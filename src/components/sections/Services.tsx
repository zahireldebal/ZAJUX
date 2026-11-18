import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SECTION_IDS, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export function Services({ locale, t, index }: { locale: Locale; t: Dictionary; index: number }) {
  const s = t.services;
  return (
    <section id={SECTION_IDS[locale].services} aria-labelledby="services-title" className="section-y relative" tabIndex={-1}>
      <div className="container-x">
        <SectionHeading index={index} eyebrow={s.eyebrow} title={s.title} intro={s.intro} id="services-title" />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4" data-reveal-group>
          {s.items.map((item, i) => (
            <li key={item.id} data-reveal-item className="card card-hover group flex flex-col p-6 lg:p-7">
              <div className="flex items-start justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-xl border border-line bg-ink text-paper transition-colors duration-500 group-hover:border-lime/40">
                  <Icon name={item.id as IconName} />
                </span>
                <span className="label-mono text-chevron">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-6 text-h3 font-medium">{item.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">{item.desc}</p>
              <div className="mt-auto pt-6">
                <p className="label-mono border-t border-line pt-4 text-[0.68rem] text-chevron">{s.includesLabel}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-paper/85">
                  {item.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5">
                      <Icon name="check" className="mt-0.5 size-4 shrink-0 text-lime" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
