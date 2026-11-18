'use client';

import { useId, useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECTION_IDS, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

/** Acordeón accesible (botón + región). La altura se anima con grid-template-rows. */
export function Faq({ locale, t, index }: { locale: Locale; t: Dictionary['faq']; index: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <section id={SECTION_IDS[locale].faq} aria-labelledby="faq-title" className="section-y relative" tabIndex={-1}>
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading index={index} eyebrow={t.eyebrow} title={t.title} id="faq-title" align="stack" />
          </div>
        </div>
        <ul className="border-t border-line lg:col-span-8" data-reveal-group>
          {t.items.map((item, i) => {
            const isOpen = open === i;
            const btn = `${base}-q${i}`;
            const panel = `${base}-a${i}`;
            return (
              <li key={item.q} className="border-b border-line" data-reveal-item>
                <h3>
                  <button
                    id={btn}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-medium sm:text-lg"
                  >
                    <span className="flex gap-4">
                      <span className="label-mono mt-1 text-chevron">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`transition-colors duration-300 ${isOpen ? 'text-paper' : 'text-paper/85 group-hover:text-paper'}`}>
                        {item.q}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative flex size-9 shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,transform] duration-500 ease-[var(--ease-out-expo)] ${
                        isOpen ? 'rotate-45 border-lime bg-lime text-ink' : 'border-line-strong text-paper group-hover:border-lime/60'
                      }`}
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pl-9 text-mute sm:pl-10">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
