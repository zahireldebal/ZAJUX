import { SectionHeading, sectionClass } from '@/components/ui/SectionHeading';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Dictionary } from '@/i18n';

export function Services({ t, level = 2 }: { t: Dictionary; level?: 1 | 2 }) {
  const s = t.services;
  return (
    <section aria-labelledby="services-title" className={sectionClass(level)}>
      <div className="container-x">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} intro={s.intro} id="services-title" level={level} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4" data-reveal-group>
          {s.items.map((item) => (
            <li key={item.id} data-reveal-item className="tile tile-hover group flex flex-col p-7 lg:p-8">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-ink text-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105">
                <Icon name={item.id as IconName} />
              </span>
              <h3 className="mt-7 text-h3 font-semibold">{item.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">{item.desc}</p>
              <div className="mt-auto pt-7">
                <p className="caption border-t border-line pt-5 text-faint">{s.includesLabel}</p>
                <ul className="mt-3 space-y-2 text-sm text-paper/85">
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
