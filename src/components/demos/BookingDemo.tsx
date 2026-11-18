'use client';

import { useState } from 'react';
import type { Dictionary } from '@/i18n';
import { fmt } from '@/lib/format';

type T = Dictionary['demos']['booking'];

interface Day {
  key: string;
  weekday: string;
  date: string;
  long: string;
}

/** Próximos 6 días hábiles (sin domingos), con nombres en el idioma del sitio. */
function nextDays(lang: string): Day[] {
  const out: Day[] = [];
  const d = new Date();
  const wd = new Intl.DateTimeFormat(lang, { weekday: 'short' });
  const dm = new Intl.DateTimeFormat(lang, { day: 'numeric' });
  const long = new Intl.DateTimeFormat(lang, { weekday: 'long', day: 'numeric', month: 'long' });
  while (out.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue;
    out.push({ key: d.toISOString().slice(0, 10), weekday: wd.format(d).replace('.', ''), date: dm.format(d), long: long.format(d) });
  }
  return out;
}

const SLOTS = ['10:00', '10:45', '11:30', '13:00', '14:30', '15:15', '16:00', '17:30'];
/** Algunos horarios "ocupados", siempre los mismos para cada día (datos ficticios). */
const busy = (dayIdx: number, slotIdx: number) => (dayIdx * 3 + slotIdx * 5) % 7 === 0 || (dayIdx + slotIdx) % 6 === 0;

export function BookingDemo({ t, lang }: { t: T; lang: string }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<number | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const go = (s: number) => setStep(s);
  const restart = () => {
    setService(null);
    setDay(null);
    setTime(null);
    setStep(0);
  };

  const chip =
    'flex min-h-11 items-center justify-between gap-3 rounded-xl border px-4 text-left text-sm transition-[border-color,background-color,color,transform] duration-300 active:scale-[0.97]';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t.business}</p>
        <ol className="flex items-center gap-1.5" aria-label={t.steps.join(' → ')}>
          {t.steps.map((s, i) => (
            <li
              key={s}
              aria-current={i === step ? 'step' : undefined}
              className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-6 bg-lime' : 'w-3 bg-line-strong'}`}
            >
              <span className="sr-only">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative mt-5 flex-1" aria-live="polite">
        {step === 0 && (
          <div key="s0" className="demo-step">
            <p className="label-mono text-[0.68rem] text-faint">{t.pickService}</p>
            <ul className="mt-3 grid gap-2">
              {t.services.map((s, i) => (
                <li key={s.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setService(i);
                      setDays(nextDays(lang));
                      go(1);
                    }}
                    className={`${chip} w-full border-line-strong hover:border-lime/60`}
                  >
                    <span>{s.name}</span>
                    <span className="label-mono text-[0.68rem] text-mute">{s.duration}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 1 && (
          <div key="s1" className="demo-step">
            <p className="label-mono text-[0.68rem] text-faint">{t.pickDay}</p>
            <ul className="mt-3 grid grid-cols-3 gap-2">
              {days.map((d, i) => (
                <li key={d.key}>
                  <button
                    type="button"
                    aria-label={d.long}
                    onClick={() => {
                      setDay(i);
                      go(2);
                    }}
                    className={`${chip} w-full flex-col justify-center gap-0 py-2 border-line-strong hover:border-lime/60`}
                  >
                    <span className="text-xs capitalize text-mute">{d.weekday}</span>
                    <span className="text-lg font-semibold">{d.date}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => go(0)} className="link-grow mt-4 inline-flex min-h-11 items-center text-sm text-mute">
              ← {t.back}
            </button>
          </div>
        )}

        {step === 2 && day !== null && (
          <div key="s2" className="demo-step">
            <p className="label-mono text-[0.68rem] text-faint">
              {t.pickTime} · <span className="capitalize">{days[day]?.long}</span>
            </p>
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {SLOTS.map((s, i) => {
                const off = busy(day, i);
                return (
                  <li key={s}>
                    <button
                      type="button"
                      disabled={off}
                      aria-label={off ? `${s} · ${t.unavailable}` : s}
                      onClick={() => {
                        setTime(s);
                        go(3);
                      }}
                      className={`${chip} w-full justify-center px-0 font-mono ${
                        off ? 'cursor-not-allowed border-line text-faint line-through' : 'border-line-strong hover:border-lime/60'
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={() => go(1)} className="link-grow mt-4 inline-flex min-h-11 items-center text-sm text-mute">
              ← {t.back}
            </button>
          </div>
        )}

        {step === 3 && service !== null && day !== null && time && (
          <div key="s3" className="demo-step flex h-full flex-col items-start justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-lime text-ink">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path className="demo-check" d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-4 text-xl font-semibold">{t.done}</p>
            <p className="mt-1 text-mute first-letter:uppercase">
              {fmt(t.summary, { service: t.services[service]!.name, day: days[day]!.long, time })}
            </p>
            <button type="button" onClick={restart} className="btn btn-ghost mt-6 !min-h-11 !text-sm">
              {t.restart}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
