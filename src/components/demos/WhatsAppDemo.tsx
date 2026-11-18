'use client';

import { useId, useState } from 'react';
import type { Dictionary } from '@/i18n';
import { fmt } from '@/lib/format';

type T = Dictionary['demos']['whatsapp'];

export function WhatsAppDemo({ t }: { t: T }) {
  const id = useId();
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [issue, setIssue] = useState<string>(t.issues[0]!);
  const [when, setWhen] = useState<string>(t.whenOptions[0]!);
  const [sent, setSent] = useState(false);

  const preview = fmt(t.template, {
    name: name.trim() || t.empty,
    vehicle: vehicle.trim() || t.empty,
    issue,
    when: when.toLowerCase(),
  });

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1.5 text-xs text-mute" htmlFor={`${id}-n`}>
          {t.name}
          <input
            id={`${id}-n`}
            className="field !min-h-11 !py-2 text-paper"
            placeholder={t.namePlaceholder}
            value={name}
            maxLength={30}
            onChange={(e) => {
              setName(e.target.value);
              setSent(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-mute" htmlFor={`${id}-v`}>
          {t.vehicle}
          <input
            id={`${id}-v`}
            className="field !min-h-11 !py-2 text-paper"
            placeholder={t.vehiclePlaceholder}
            value={vehicle}
            maxLength={30}
            onChange={(e) => {
              setVehicle(e.target.value);
              setSent(false);
            }}
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-xs text-mute">{t.issue}</legend>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {t.issues.map((i) => (
            <label
              key={i}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line-strong px-3.5 text-sm transition-colors has-[:checked]:border-lime has-[:checked]:bg-lime has-[:checked]:text-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lime"
            >
              <input type="radio" name={`${id}-issue`} className="sr-only" checked={issue === i} onChange={() => setIssue(i)} />
              {i}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-xs text-mute" htmlFor={`${id}-w`}>
        {t.when}
        <select id={`${id}-w`} className="field !min-h-11 !py-2 text-paper" value={when} onChange={(e) => setWhen(e.target.value)}>
          {t.whenOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>

      <div className="mt-auto rounded-2xl border border-line bg-[#0b141a] p-3">
        <p className="label-mono text-[0.62rem] text-chevron">{t.preview}</p>
        <div className="mt-2 flex justify-end">
          <p
            aria-live="polite"
            className="relative max-w-[92%] rounded-xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-[0.85rem] leading-snug text-[#e9edef]"
          >
            {preview}
            <span className="mt-1 block text-right text-[0.65rem] text-[#e9edef]/70">
              12:04 {sent && <span className="text-[#53bdeb]">✓✓</span>}
            </span>
          </p>
        </div>
      </div>
      <button type="button" onClick={() => setSent(true)} className="btn btn-ghost !min-h-11 !text-sm">
        {t.send}
      </button>
      <p className="min-h-5 text-xs text-mute" aria-live="polite">
        {sent ? t.sentNote : ''}
      </p>
    </div>
  );
}
