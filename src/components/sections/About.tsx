import { SectionHeading, sectionClass } from '@/components/ui/SectionHeading';
import { Flag } from '@/components/brand/Flag';
import { PEOPLE, type PersonId } from '@/data/business';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { fmt } from '@/lib/format';

/** Placeholder elegante hasta tener fotos reales: monograma sobre cuadrícula. */
function Monogram({ initials, label }: { initials: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[calc(var(--radius-card)-0.75rem)] bg-ink"
    >
      <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-70 [mask-image:none]" />
      <svg aria-hidden="true" viewBox="0 0 200 120" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="100" cy="60" rx="88" ry="30" transform="rotate(-8 100 60)" stroke="rgb(198 244 50 / 0.25)" strokeDasharray="2 6" />
      </svg>
      <span
        aria-hidden="true"
        className="relative font-mono text-[clamp(3.5rem,9vw,5.5rem)] font-bold tracking-[0.08em] text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]"
      >
        {initials.slice(0, 1)}
        <span className="text-lime [-webkit-text-stroke:0]">{initials.slice(1)}</span>
      </span>
    </div>
  );
}

export function About({ locale, t, level = 2 }: { locale: Locale; t: Dictionary; level?: 1 | 2 }) {
  const a = t.about;
  const ids: PersonId[] = locale === 'es' ? ['juani', 'zahir'] : ['zahir', 'juani'];
  return (
    <section aria-labelledby="about-title" className={sectionClass(level)}>
      <div className="container-x">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} intro={a.text} id="about-title" level={level} />
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20" data-reveal-group>
          {ids.map((id) => {
            const p = PEOPLE[id];
            return (
              <li key={id} data-reveal-item className="tile tile-hover p-3">
                <Monogram initials={p.initials} label={fmt(a.photoAlt, { name: p.name })} />
                <div className="flex flex-col gap-5 p-4 pt-6 sm:flex-row sm:items-end sm:justify-between lg:p-5 lg:pt-7">
                  <div>
                    <h3 className="text-h3 font-semibold">{p.name}</h3>
                    <p className="mt-2 flex items-center gap-2.5 text-mute">
                      <Flag code={p.countryCode} label={t.common.flags[p.countryCode]} />
                      {p.city}, {t.common.countries[p.countryCode]}
                    </p>
                    <p className="caption mt-3 text-faint">{a.roles[id]}</p>
                  </div>
                  <div>
                    <p className="caption text-faint sm:text-right">{a.languages}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5 sm:justify-end">
                      {p.languages.map((l) => (
                        <li key={l} className="rounded-full bg-ink px-3.5 py-1.5 text-sm">
                          {t.common.languageNames[l]}
                        </li>
                      ))}
                    </ul>
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
