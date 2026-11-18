'use client';

import {
  LOCALES,
  LOCALE_LABEL,
  LOCALE_STORAGE_KEY,
  SECTION_IDS,
  homePath,
  legalPath,
  sectionKeyFromId,
  type LegalKey,
  type Locale,
} from '@/i18n/config';
import { getActiveSection } from '@/lib/activeSection';
import { writeStorage } from '@/lib/storage';

/**
 * Selector ES · PT · EN. Los enlaces funcionan sin JavaScript (van al inicio o a la
 * misma página legal); con JavaScript, además mantienen la sección visible y guardan
 * la elección.
 */
export function LangSwitcher({
  locale,
  label,
  legalKey,
  className = '',
  size = 'sm',
}: {
  locale: Locale;
  label: string;
  legalKey?: LegalKey;
  className?: string;
  size?: 'sm' | 'lg';
}) {
  const hrefFor = (l: Locale) => (legalKey ? legalPath(l, legalKey) : homePath(l));

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, l: Locale) => {
    writeStorage(LOCALE_STORAGE_KEY, l);
    if (l === locale || legalKey) return;
    e.preventDefault();
    const fromHash = sectionKeyFromId(locale, decodeURIComponent(window.location.hash.slice(1)));
    const key = getActiveSection() ?? fromHash;
    const target = key ? `${homePath(l)}#${SECTION_IDS[l][key]}` : homePath(l);
    window.location.assign(target);
  };

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center">
        {LOCALES.map((l, i) => (
          <li key={l} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="px-0.5 text-chevron">
                ·
              </span>
            )}
            <a
              href={hrefFor(l)}
              hrefLang={l === 'pt' ? 'pt-BR' : l}
              lang={l === 'pt' ? 'pt-BR' : l}
              aria-current={l === locale ? 'true' : undefined}
              aria-label={LOCALE_LABEL[l]}
              onClick={(e) => onClick(e, l)}
              className={`label-mono inline-flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors duration-300 ${
                size === 'lg' ? 'text-sm' : ''
              } ${l === locale ? 'text-lime' : 'text-mute hover:text-paper'}`}
            >
              {l.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

