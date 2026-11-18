'use client';

import { CONTACT_ID, LOCALES, LOCALE_LABEL, LOCALE_STORAGE_KEY, routePath, type Locale, type RouteKey } from '@/i18n/config';
import { writeStorage } from '@/lib/storage';

/**
 * Selector ES · PT · EN. Cada enlace lleva a la misma página en el otro idioma
 * (funciona sin JavaScript); con JavaScript, además guarda la elección y, si se
 * estaba en el contacto del inicio, mantiene esa posición.
 */
export function LangSwitcher({
  locale,
  label,
  route,
  className = '',
  size = 'sm',
}: {
  locale: Locale;
  label: string;
  route: RouteKey;
  className?: string;
  size?: 'sm' | 'lg';
}) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, l: Locale) => {
    writeStorage(LOCALE_STORAGE_KEY, l);
    if (l === locale || route !== 'home') return;
    if (decodeURIComponent(window.location.hash.slice(1)) !== CONTACT_ID[locale]) return;
    e.preventDefault();
    window.location.assign(`${routePath(l, 'home')}#${CONTACT_ID[l]}`);
  };

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center">
        {LOCALES.map((l) => (
          <li key={l}>
            <a
              href={routePath(l, route)}
              hrefLang={l === 'pt' ? 'pt-BR' : l}
              lang={l === 'pt' ? 'pt-BR' : l}
              aria-current={l === locale ? 'true' : undefined}
              aria-label={`${l.toUpperCase()} — ${LOCALE_LABEL[l]}`}
              onClick={(e) => onClick(e, l)}
              className={`caption inline-flex min-h-11 min-w-10 items-center justify-center rounded-full transition-colors duration-300 ${
                size === 'lg' ? '!text-sm' : ''
              } ${l === locale ? 'text-paper' : 'text-faint hover:text-paper'}`}
            >
              <span className={`rounded-full px-2 py-1 ${l === locale ? 'bg-surface-2' : ''}`}>{l.toUpperCase()}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
