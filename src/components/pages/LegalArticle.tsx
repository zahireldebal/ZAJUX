import { HREFLANG, LEGAL_KEYS, homePath, legalPath, type LegalKey, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { getLegal, type LegalBlock } from '@/i18n/legal';
import { BUSINESS, LEGAL_UPDATED, PRIVACY_POLICY } from '@/data/business';
import { fmt } from '@/lib/format';

/** Página legal: índice fijo a la izquierda (desktop) y texto a la derecha. */
export function LegalArticle({ locale, legalKey: key }: { locale: Locale; legalKey: LegalKey }) {
  const t = getDictionary(locale);
  const doc = getLegal(locale)[key];
  const vars = { email: BUSINESS.email, version: `v${PRIVACY_POLICY.version}`, date: PRIVACY_POLICY.date };
  const dateFmt = new Intl.DateTimeFormat(HREFLANG[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const updated = dateFmt.format(new Date(`${LEGAL_UPDATED}T12:00:00Z`));

  const block = (b: LegalBlock, i: number) =>
    Array.isArray(b) ? (
      <ul key={i} className="mt-4 space-y-2.5">
        {b.map((li) => (
          <li key={li} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-lime" />
            <span>{fmt(li, vars)}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p key={i} className="mt-4">
        {fmt(b, vars)}
      </p>
    );

  return (
    <article className="container-x pb-24 pt-32 sm:pt-40">
      <header className="max-w-3xl">
        <p className="eyebrow">{t.footer.legal}</p>
        <h1 className="mt-4 text-h1 font-semibold">{t.legal.titles[key]}</h1>
        <dl className="caption mt-6 flex flex-wrap gap-x-6 gap-y-2 text-mute">
          <div className="flex gap-2">
            <dt className="text-faint">{t.legal.updated}</dt>
            <dd>
              <time dateTime={LEGAL_UPDATED}>{updated}</time>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-faint">{t.legal.version}</dt>
            <dd>v{PRIVACY_POLICY.version}</dd>
          </div>
        </dl>
        <p className="mt-8 text-lead text-paper/90">{doc.intro}</p>
      </header>

      <div className="mt-14 grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-10">
        <nav aria-label={t.legal.toc} className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="caption text-faint">{t.legal.toc}</h2>
            <ul className="mt-4 space-y-1 border-l border-line">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px flex min-h-10 items-center border-l border-transparent py-1.5 pl-4 text-sm text-mute transition-colors hover:border-lime hover:text-paper"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="max-w-2xl text-[1.0625rem] leading-relaxed text-paper/85 lg:col-span-8">
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-b border-line pb-10 pt-2 [&:not(:first-child)]:pt-10">
              <h2 id={`${s.id}-h`} className="text-h3 font-semibold text-paper">
                {s.title}
              </h2>
              {s.blocks.map(block)}
            </section>
          ))}

          <div className="mt-12">
            <h2 className="caption text-faint">{t.legal.otherPolicies}</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {LEGAL_KEYS.filter((k) => k !== key).map((k) => (
                <li key={k}>
                  <a href={legalPath(locale, k)} className="btn btn-ghost !min-h-11 !text-sm">
                    {t.legal.titles[k]}
                  </a>
                </li>
              ))}
              <li>
                <a href={homePath(locale)} className="link-grow inline-flex min-h-11 items-center px-2 text-sm text-mute hover:text-paper">
                  ← {t.legal.back}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
