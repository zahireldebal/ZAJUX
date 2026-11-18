import { Isotype } from '@/components/brand/Isotype';
import { Wordmark } from '@/components/brand/Wordmark';
import { LangSwitcher } from './LangSwitcher';
import { LEGAL_KEYS, homePath, legalPath, sectionHref, type LegalKey, type Locale, type SectionKey } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { BUSINESS, hasContactEmail } from '@/data/business';

export function Footer({
  locale,
  dict,
  links,
  legalKey,
}: {
  locale: Locale;
  dict: Dictionary;
  links: SectionKey[];
  legalKey?: LegalKey;
}) {
  const t = dict.footer;
  const linkCls = 'link-grow inline-flex min-h-11 items-center text-mute transition-colors duration-300 hover:text-paper';
  return (
    <footer className="relative border-t border-line bg-ink pb-24 pt-16 lg:pb-12 lg:pt-24">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href={homePath(locale)} aria-label={dict.common.home} className="inline-flex items-center gap-3 rounded-lg">
              <Isotype className="size-11" />
              <Wordmark className="h-[20px]" idPrefix="footer" />
            </a>
            <p className="mt-6 max-w-sm text-mute">{t.tagline}</p>
            <p className="label-mono mt-6 text-paper">{t.location}</p>
          </div>

          <nav aria-label={t.sections} className="md:col-span-3">
            <h2 className="label-mono text-chevron">{t.sections}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1">
              {[...links, 'contact' as const].map((k) => (
                <li key={k}>
                  <a href={sectionHref(locale, k)} className={linkCls}>
                    {dict.nav.links[k]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <nav aria-label={t.legal}>
              <h2 className="label-mono text-chevron">{t.legal}</h2>
              <ul className="mt-4">
                {LEGAL_KEYS.map((k) => (
                  <li key={k}>
                    <a href={legalPath(locale, k)} className={linkCls} aria-current={legalKey === k ? 'page' : undefined}>
                      {dict.legal.titles[k]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <h2 className="label-mono mt-8 text-chevron">{t.contact}</h2>
            <ul className="mt-4">
              {hasContactEmail() && (
                <li>
                  <a href={`mailto:${BUSINESS.email}`} className={linkCls}>
                    {BUSINESS.email}
                  </a>
                </li>
              )}
              <li>
                <a href={BUSINESS.instagram} className={linkCls} rel="noopener noreferrer" target="_blank">
                  Instagram · @zajux.web
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-mute">{t.rights}</p>
          <div className="flex items-center gap-4">
            <LangSwitcher locale={locale} label={dict.common.language} legalKey={legalKey} className="-ml-3 md:ml-0" />
            <a href="#top" className="label-mono inline-flex min-h-11 items-center gap-2 text-mute transition-colors hover:text-lime">
              {t.backToTop}
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
