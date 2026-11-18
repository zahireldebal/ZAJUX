import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HREFLANG, LEGAL_KEYS, LEGAL_SLUGS, homePath, isLocale, legalKeyFromSlug, legalPath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { getLegal, type LegalBlock } from '@/i18n/legal';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS, LEGAL_UPDATED, PRIVACY_POLICY } from '@/data/business';
import { fmt } from '@/lib/format';

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  const locale: Locale = params.locale;
  return LEGAL_KEYS.map((k) => ({ slug: LEGAL_SLUGS[locale][k] }));
}

type Params = { params: Promise<{ locale: string; slug: string }> };

function resolve(locale: string, slug: string) {
  if (!isLocale(locale)) return null;
  const key = legalKeyFromSlug(locale, slug);
  return key ? { locale, key } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const r = resolve(locale, slug);
  if (!r) return {};
  const t = getDictionary(r.locale);
  return buildMetadata(r.locale, {
    legalKey: r.key,
    title: t.legal.titles[r.key],
    description: getLegal(r.locale)[r.key].description,
  });
}

export default async function LegalPage({ params }: Params) {
  const { locale: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) notFound();
  const { locale, key } = r;
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
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-lime" />
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
    <SiteChrome locale={locale} legalKey={key}>
      <MotionProvider />
      <article className="container-x pb-24 pt-32 sm:pt-40">
        <header className="max-w-3xl">
          <p className="label-mono text-lime">
            &lt;/&gt; {t.footer.legal}
          </p>
          <h1 className="mt-5 text-h1 font-semibold">{t.legal.titles[key]}</h1>
          <dl className="label-mono mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.7rem] text-mute">
            <div className="flex gap-2">
              <dt className="text-chevron">{t.legal.updated}</dt>
              <dd>
                <time dateTime={LEGAL_UPDATED}>{updated}</time>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-chevron">{t.legal.version}</dt>
              <dd>v{PRIVACY_POLICY.version}</dd>
            </div>
          </dl>
          <p className="mt-8 text-lead text-paper/90">{doc.intro}</p>
        </header>

        <div className="mt-14 grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-10">
          <nav aria-label={t.legal.toc} className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="label-mono text-[0.68rem] text-chevron">{t.legal.toc}</h2>
              <ol className="mt-4 space-y-1 border-l border-line">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px flex min-h-10 items-baseline gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-mute transition-colors hover:border-lime hover:text-paper"
                    >
                      <span className="font-mono text-[0.7rem] text-chevron">{String(i + 1).padStart(2, '0')}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="max-w-2xl text-[1.0625rem] leading-relaxed text-paper/85 lg:col-span-8">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-b border-line pb-10 pt-2 [&:not(:first-child)]:pt-10">
                <h2 id={`${s.id}-h`} className="flex items-baseline gap-4 text-h3 font-medium text-paper">
                  <span className="font-mono text-sm text-lime">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                {s.blocks.map(block)}
              </section>
            ))}

            <div className="mt-12">
              <h2 className="label-mono text-[0.68rem] text-chevron">{t.legal.otherPolicies}</h2>
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
    </SiteChrome>
  );
}
