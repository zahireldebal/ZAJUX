/**
 * Lógica del formulario de contacto: validación, armado del mensaje, ruteo de
 * WhatsApp por idioma y envío por email (Web3Forms, con respaldo mailto:).
 *
 * Ruteo: ES → Juani (Uruguay) · PT y EN → Zahir (Brasil).
 */
import { z } from 'zod';
import type { Dictionary } from '@/i18n/es';

/** Textos que necesita el armado del mensaje (para pasar a componentes cliente sin todo el diccionario). */
export type ContactDict = Pick<Dictionary, 'contact' | 'services' | 'plans'>;
import { CONTACT_PERSON, HREFLANG, type Locale } from '@/i18n/config';
import { BUSINESS, PEOPLE, PRIVACY_POLICY, hasContactEmail, type PersonId } from '@/data/business';
import { fmt } from './format';

export const SERVICE_IDS = ['web', 'booking', 'store', 'apps', 'dashboards', 'automation', 'seo', 'maintenance'] as const;
export const PLAN_IDS = ['brand', 'booking', 'custom', 'maintenance'] as const;
export const COUNTRIES = ['uy', 'br', 'other'] as const;
export const TIMELINES = ['asap', '1m', '2-3m', 'none'] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];
export type PlanId = (typeof PLAN_IDS)[number];

export const DRAFT_KEY = 'zajux:contact-draft';
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Esquema de validación con mensajes en el idioma del sitio. */
export function createContactSchema(t: Dictionary['contact']) {
  const e = t.errors;
  return z.object({
    name: z.string().trim().min(2, e.name).max(80, e.tooLong),
    business: z.string().trim().max(100, e.tooLong),
    country: z.enum(COUNTRIES, { error: e.required }),
    service: z.enum([...SERVICE_IDS, 'unsure'], { error: e.required }),
    plan: z.union([z.enum(PLAN_IDS), z.literal('')]),
    timeline: z.union([z.enum(TIMELINES), z.literal('')]),
    hasWebsite: z.union([z.enum(['yes', 'no']), z.literal('')]),
    email: z
      .string()
      .trim()
      .max(120, e.tooLong)
      .refine((v) => v === '' || EMAIL_RE.test(v), t.emailError),
    message: z.string().trim().min(10, e.message).max(2000, e.tooLong),
    privacy: z.boolean().refine((v) => v === true, e.privacy),
  });
}

export type ContactSchema = ReturnType<typeof createContactSchema>;
export type ContactInput = z.input<ContactSchema>;
export type ContactData = z.output<ContactSchema>;

export const EMPTY_CONTACT: ContactInput = {
  name: '',
  business: '',
  country: '' as ContactInput['country'],
  service: '' as ContactInput['service'],
  plan: '',
  timeline: '',
  hasWebsite: '',
  email: '',
  message: '',
  privacy: false,
};

/* ------------------------------------------------------------------ */
/* Ruteo                                                              */
/* ------------------------------------------------------------------ */
export const contactPersonFor = (locale: Locale): PersonId => CONTACT_PERSON[locale];
export const whatsappNumberFor = (locale: Locale) => PEOPLE[contactPersonFor(locale)].whatsapp;

export function whatsappUrl(number: string, text?: string) {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/* ------------------------------------------------------------------ */
/* Etiquetas legibles                                                 */
/* ------------------------------------------------------------------ */
export function labelsFor(data: ContactData, d: ContactDict) {
  const o = d.contact.options;
  const service =
    data.service === 'unsure' ? o.serviceUnsure : (d.services.items.find((s) => s.id === data.service)?.title ?? data.service);
  const plan = data.plan ? (d.plans.items.find((p) => p.id === data.plan)?.name ?? data.plan) : '';
  return {
    country: o.country[data.country],
    service,
    plan,
    timeline: data.timeline ? o.timeline[data.timeline] : '',
    hasWebsite: data.hasWebsite ? o.yesNo[data.hasWebsite] : '',
  };
}

/**
 * Mensaje en el idioma del sitio, solo con los campos completados. Ej. (ES):
 * "Hola, soy *Ana*, de *Café Central* (Uruguay).\nNecesito: *Sitio web*.\n…"
 */
export function buildMessage(data: ContactData, d: ContactDict): string {
  const m = d.contact.message;
  const l = labelsFor(data, d);
  const end = (s: string) => (/[.!?…]$/.test(s) ? s : `${s}.`);

  let first = fmt(m.greeting, { name: data.name.trim() });
  if (data.business.trim()) first += fmt(m.from, { business: data.business.trim() });
  first += fmt(m.country, { country: l.country });

  const lines = [end(first), end(fmt(m.need, { service: l.service }))];
  if (l.plan) lines.push(end(fmt(m.plan, { plan: l.plan })));
  if (l.timeline) lines.push(end(fmt(m.timeline, { timeline: l.timeline })));
  if (l.hasWebsite) lines.push(end(fmt(m.hasWebsite, { hasWebsite: l.hasWebsite })));
  lines.push(fmt(m.message, { message: data.message.trim() }));
  if (data.email.trim()) lines.push(fmt(m.email, { email: data.email.trim() }));
  return lines.join('\n');
}

/** Mensaje sin el formato de WhatsApp (*negrita*), para el email. */
export const plainText = (msg: string) => msg.replace(/\*([^*\n]+)\*/g, '$1');

/* ------------------------------------------------------------------ */
/* Email                                                              */
/* ------------------------------------------------------------------ */
export const policyVersionLabel = (locale: Locale) => {
  const word = { es: 'privacidad', pt: 'privacidade', en: 'privacy' }[locale];
  return `${word} v${PRIVACY_POLICY.version} · ${PRIVACY_POLICY.date}`;
};

/** Fecha en UTC legible: "2026-11-17 21:04:05 UTC". */
export const utcStamp = (now: Date) => `${now.toISOString().slice(0, 19).replace('T', ' ')} UTC`;

/**
 * Datos que viajan en el email. Incluye fecha (UTC e ISO), idioma y la versión de la
 * Política de Privacidad aceptada: ese es el registro del consentimiento.
 */
export function buildEmailPayload(data: ContactData, d: ContactDict, locale: Locale, now: Date = new Date()) {
  const meta = d.contact.emailMeta;
  const message = plainText(buildMessage(data, d));
  const consent = fmt(meta.consentValue, { version: policyVersionLabel(locale) });
  const footer = [
    '—',
    `${meta.sentAt}: ${utcStamp(now)}`,
    `${meta.sentAtIso}: ${now.toISOString()}`,
    `${meta.locale}: ${HREFLANG[locale]}`,
    `${meta.consent}: ${consent}`,
  ].join('\n');
  return {
    subject: fmt(meta.subject, { name: data.name.trim() }),
    from_name: data.name.trim(),
    replyto: data.email.trim() || undefined,
    email: data.email.trim() || undefined,
    message: `${message}\n\n${footer}`,
    [meta.sentAt]: utcStamp(now),
    [meta.sentAtIso]: now.toISOString(),
    [meta.locale]: HREFLANG[locale],
    [meta.consent]: consent,
  };
}

export function mailtoUrl(subject: string, body: string, to: string = BUSINESS.email) {
  return `mailto:${hasContactEmail() ? to : ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type SendResult = { ok: true; via: 'web3forms' | 'mailto'; mailto?: string } | { ok: false };

/**
 * Envía por Web3Forms si hay clave configurada; si no, devuelve un mailto: armado.
 * `key` y `fetcher` se pueden inyectar para los tests.
 */
export async function sendEmail(
  payload: ReturnType<typeof buildEmailPayload>,
  key: string | undefined = process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
  fetcher: typeof fetch = fetch,
): Promise<SendResult> {
  if (!key) {
    return { ok: true, via: 'mailto', mailto: mailtoUrl(payload.subject, payload.message) };
  }
  try {
    const res = await fetcher(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: key, botcheck: false, ...payload }),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && json.success !== false ? { ok: true, via: 'web3forms' } : { ok: false };
  } catch {
    return { ok: false };
  }
}
