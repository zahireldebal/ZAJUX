import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECTION_IDS, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export function Why({ locale, t, index }: { locale: Locale; t: Dictionary; index: number }) {
  const w = t.why;
  return (
    <section id={SECTION_IDS[locale].why} aria-labelledby="why-title" className="section-y relative" tabIndex={-1}>
      <div className="container-x">
        <SectionHeading index={index} eyebrow={w.eyebrow} title={w.title} id="why-title" align="stack" />
        <ul
          className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
          data-reveal-group
        >
          {w.items.map((item, i) => (
            <li
              key={item.title}
              data-reveal-item
              className="group relative border-b border-r border-line p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-8 lg:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-0 bg-lime transition-[width] duration-700 ease-[var(--ease-out-expo)] group-hover:w-full"
              />
              <span className="label-mono text-lime">{`0${i + 1}`}</span>
              <h3 className="mt-8 text-h3 font-medium lg:mt-14">{item.title}</h3>
              <p className="mt-3 max-w-sm text-mute">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
