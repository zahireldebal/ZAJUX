'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  COUNTRIES,
  DRAFT_KEY,
  EMPTY_CONTACT,
  PLAN_IDS,
  TIMELINES,
  buildEmailPayload,
  buildMessage,
  createContactSchema,
  sendEmail,
  whatsappNumberFor,
  whatsappUrl,
  type ContactData,
  type ContactDict,
  type ContactInput,
  type PlanId,
} from '@/lib/contact';
import { readJSON, removeStorage, writeStorage } from '@/lib/storage';
import { legalPath, type Locale } from '@/i18n/config';
import { fmt } from '@/lib/format';

export const DRAFT_SYNC_EVENT = 'zajux:draft-sync';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; text: string }
  | { kind: 'error'; text: string };

/** Muestra *negritas* de WhatsApp como <strong> en la vista previa. */
function renderWhatsApp(text: string): ReactNode[] {
  return text.split('\n').map((line, i) => (
    <span key={i} className="block">
      {line.split(/(\*[^*\n]+\*)/g).map((part, j) =>
        /^\*[^*]+\*$/.test(part) ? <strong key={j} className="font-semibold text-paper">{part.slice(1, -1)}</strong> : part,
      )}
    </span>
  ));
}

function Field({
  id,
  label,
  required,
  requiredLabel,
  optionalLabel,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  requiredLabel: string;
  optionalLabel: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium">
        <span>
          {label}
          {required && (
            <span className="ml-1 text-lime" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> ({requiredLabel})</span>}
        </span>
        {!required && <span className="label-mono text-[0.62rem] text-chevron">{optionalLabel}</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-mute">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({
  locale,
  dict,
  initialPlan,
  idPrefix = 'cf',
  onSent,
}: {
  locale: Locale;
  dict: ContactDict;
  initialPlan?: PlanId;
  idPrefix?: string;
  onSent?: () => void;
}) {
  const t = dict.contact;
  const schema = useMemo(() => createContactSchema(t), [t]);
  const uid = useId().replace(/:/g, '');
  const id = (f: string) => `${idPrefix}-${uid}-${f}`;
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [data, setData] = useState<ContactData | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  /** Guardado pendiente del borrador (se cancela al enviar). */
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    subscribe,
    setError,
    setFocus,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_CONTACT,
    mode: 'onTouched',
  });

  // Cargar borrador (y plan preseleccionado)
  useEffect(() => {
    // Solo restaura si hay un borrador guardado: así no se pisa lo que la persona
    // haya escrito antes de que la página terminara de cargar.
    const load = (sync = false) => {
      const draft = readJSON<Partial<ContactInput>>(DRAFT_KEY);
      if (draft) reset({ ...EMPTY_CONTACT, ...draft, privacy: getValues('privacy') ?? false });
      else if (sync) reset({ ...EMPTY_CONTACT });
      if (initialPlan) setValue('plan', initialPlan);
    };
    load();
    // Ignorar el aviso que dispara este mismo formulario al enviar
    const onSync = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== uid) load(true);
    };
    window.addEventListener(DRAFT_SYNC_EVENT, onSync);
    return () => window.removeEventListener(DRAFT_SYNC_EVENT, onSync);
  }, [reset, initialPlan, setValue, getValues, uid]);

  // Guardar borrador mientras se escribe
  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const { privacy: _privacy, ...rest } = values;
        void _privacy;
        // Un plan preseleccionado solo no cuenta como borrador
        const { plan: _plan, ...typed } = rest;
        void _plan;
        const hasContent = Object.values(typed).some((v) => typeof v === 'string' && v.trim() !== '');
        if (hasContent) writeStorage(DRAFT_KEY, JSON.stringify(rest));
      }, 350);
      },
    });
    return () => {
      clearTimeout(saveTimer.current);
      unsubscribe();
    };
  }, [subscribe]);

  // Llevar el foco a la vista previa al mostrarla (lectores de pantalla y teclado)
  useEffect(() => {
    if (step === 'preview') previewRef.current?.focus();
  }, [step]);

  const message = data ? buildMessage(data, dict) : '';

  const toPreview = handleSubmit(
    (values) => {
      setData(values);
      setStatus({ kind: 'idle' });
      setStep('preview');
    },
    () => setStatus({ kind: 'idle' }),
  );

  const finish = (text: string) => {
    clearTimeout(saveTimer.current);
    removeStorage(DRAFT_KEY);
    window.dispatchEvent(new CustomEvent(DRAFT_SYNC_EVENT, { detail: uid }));
    setStatus({ kind: 'success', text });
    onSent?.();
  };

  const sendWhatsApp = () => {
    if (!data) return;
    window.open(whatsappUrl(whatsappNumberFor(locale), message), '_blank', 'noopener,noreferrer');
    finish(t.successWhatsApp);
  };

  const sendByEmail = async () => {
    if (!data) return;
    if (!data.email.trim()) {
      setStep('form');
      setError('email', { message: t.emailNeeded });
      requestAnimationFrame(() => setFocus('email'));
      return;
    }
    setStatus({ kind: 'sending' });
    const result = await sendEmail(buildEmailPayload(data, dict, locale));
    if (!result.ok) {
      setStatus({ kind: 'error', text: t.error });
      return;
    }
    if (result.via === 'mailto' && result.mailto) {
      window.location.assign(result.mailto);
      finish(t.mailtoNote);
      return;
    }
    finish(t.success);
    reset({ ...EMPTY_CONTACT });
  };

  const err = (f: keyof ContactInput) => errors[f]?.message as string | undefined;
  const aria = (f: keyof ContactInput, hint = false) => ({
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `${id(f)}-error` : hint ? `${id(f)}-hint` : undefined,
  });
  const fp = { requiredLabel: t.required, optionalLabel: t.optional };

  if (step === 'preview' && data) {
    const isSending = status.kind === 'sending';
    return (
      <div>
        <div ref={previewRef} tabIndex={-1} className="outline-none">
          <h3 className="text-h3 font-medium">{t.previewTitle}</h3>
          <p className="mt-2 text-mute">{t.previewIntro}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-ink p-4 sm:p-5">
          <div className="max-w-[34rem] rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-3 text-[0.95rem] leading-relaxed text-paper/90">
            {renderWhatsApp(message)}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={sendWhatsApp} className="btn btn-primary" disabled={isSending}>
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
            </svg>
            {t.sendWhatsApp}
          </button>
          <button type="button" onClick={sendByEmail} className="btn btn-ghost" disabled={isSending} aria-busy={isSending}>
            {isSending ? t.sending : t.sendEmail}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('form');
              setStatus({ kind: 'idle' });
            }}
            className="link-grow inline-flex min-h-12 items-center px-2 text-mute hover:text-paper sm:ml-auto"
          >
            {t.edit}
          </button>
        </div>

        <p role="status" aria-live="polite" className="mt-5 min-h-6 text-sm">
          {status.kind === 'success' && <span className="text-lime">{status.text}</span>}
          {status.kind === 'error' && <span className="text-danger">{status.text}</span>}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={toPreview} noValidate className="grid gap-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
      <Field id={id('name')} label={t.fields.name} required error={err('name')} {...fp}>
        <input id={id('name')} type="text" autoComplete="name" placeholder={t.placeholders.name} className="field" {...register('name')} {...aria('name')} />
      </Field>
      <Field id={id('business')} label={t.fields.business} error={err('business')} {...fp}>
        <input id={id('business')} type="text" autoComplete="organization" className="field" {...register('business')} {...aria('business')} />
      </Field>

      <Field id={id('country')} label={t.fields.country} required error={err('country')} {...fp}>
        <select id={id('country')} className="field" {...register('country')} {...aria('country')}>
          <option value="">{t.placeholders.select}</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {t.options.country[c]}
            </option>
          ))}
        </select>
      </Field>
      <Field id={id('service')} label={t.fields.service} required error={err('service')} {...fp}>
        <select id={id('service')} className="field" {...register('service')} {...aria('service')}>
          <option value="">{t.placeholders.select}</option>
          {dict.services.items.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
          <option value="unsure">{t.options.serviceUnsure}</option>
        </select>
      </Field>

      <Field id={id('plan')} label={t.fields.plan} error={err('plan')} hint={initialPlan ? t.plansHint : undefined} {...fp}>
        <select id={id('plan')} className="field" {...register('plan')} {...aria('plan', !!initialPlan)}>
          <option value="">{t.options.planNone}</option>
          {PLAN_IDS.map((p) => (
            <option key={p} value={p}>
              {dict.plans.items.find((x) => x.id === p)?.name}
            </option>
          ))}
        </select>
      </Field>
      <Field id={id('timeline')} label={t.fields.timeline} error={err('timeline')} {...fp}>
        <select id={id('timeline')} className="field" {...register('timeline')} {...aria('timeline')}>
          <option value="">{t.placeholders.select}</option>
          {TIMELINES.map((v) => (
            <option key={v} value={v}>
              {t.options.timeline[v]}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-medium">
          {t.fields.hasWebsite}
          <span className="label-mono text-[0.62rem] text-chevron">{t.optional}</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(['yes', 'no'] as const).map((v) => (
            <label
              key={v}
              className="relative flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-line-strong text-sm transition-colors has-[:checked]:border-lime has-[:checked]:bg-lime/10 has-[:checked]:text-lime has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lime"
            >
              <input type="radio" value={v} className="sr-only" {...register('hasWebsite')} />
              {t.options.yesNo[v]}
            </label>
          ))}
        </div>
      </fieldset>
      <Field id={id('email')} label={t.emailField} error={err('email')} hint={t.emailHint} {...fp}>
        <input
          id={id('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          className="field"
          {...register('email')}
          {...aria('email', true)}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field id={id('message')} label={t.fields.message} required error={err('message')} {...fp}>
          <textarea
            id={id('message')}
            rows={5}
            placeholder={t.placeholders.message}
            className="field min-h-36 resize-y"
            {...register('message')}
            {...aria('message')}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={id('privacy')} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
          <input
            id={id('privacy')}
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--color-lime)]"
            {...register('privacy')}
            {...aria('privacy')}
          />
          <span>
            {fmt(t.fields.privacy, { link: '\u0000' })
              .split('\u0000')
              .flatMap((part, i) =>
                i === 0
                  ? [part]
                  : [
                      <a key="l" href={legalPath(locale, 'privacy')} target="_blank" rel="noopener" className="text-lime underline underline-offset-4">
                        {t.fields.privacyLink}
                      </a>,
                      part,
                    ],
              )}
            <span className="ml-1 text-lime" aria-hidden="true">
              *
            </span>
          </span>
        </label>
        {err('privacy') && (
          <p id={`${id('privacy')}-error`} role="alert" className="mt-2 text-sm text-danger">
            {err('privacy')}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-mute">{t.draftSaved}</p>
        <button type="submit" className="btn btn-primary">
          {t.review}
          <svg viewBox="0 0 16 16" className="btn-arrow size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only sm:col-span-2">
        {status.kind === 'success' ? status.text : ''}
      </p>
    </form>
  );
}
