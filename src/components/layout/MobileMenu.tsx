'use client';

import { useEffect, useRef } from 'react';
import { ContactButton } from '@/components/contact/ContactButton';
import { LangSwitcher } from './LangSwitcher';
import { homePath, sectionHref, type LegalKey, type Locale, type SectionKey } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { useScrollLock } from '@/lib/useScrollLock';
import { useFocusTrap } from '@/lib/useFocusTrap';

export function MobileMenu({
  open,
  onClose,
  locale,
  nav,
  languageLabel,
  links,
  legalKey,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  nav: Dictionary['nav'];
  languageLabel: string;
  links: SectionKey[];
  legalKey?: LegalKey;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useFocusTrap(panel, open, onClose, "#menu-toggle");

  // Cerrar si la pantalla pasa a desktop
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 64rem)');
    const fn = () => mq.matches && onClose();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [open, onClose]);

  const all: SectionKey[] = [...links, 'contact'];

  return (
    <div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={nav.label}
      inert={!open}
      className={`fixed inset-0 z-40 flex flex-col bg-ink pt-16 transition-[opacity,visibility] duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <nav aria-label={nav.label} className="container-x flex-1 overflow-y-auto py-6">
        <ol className="flex flex-col">
          {all.map((k, i) => (
            <li
              key={k}
              className={`border-b border-line transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
            >
              <a
                href={legalKey ? sectionHref(locale, k) : sectionHref(locale, k).replace(homePath(locale), '')}
                onClick={onClose}
                className="flex min-h-14 items-baseline gap-4 py-3 text-[1.75rem] font-medium tracking-tight"
              >
                <span className="label-mono w-8 text-mute">{String(i + 1).padStart(2, '0')}</span>
                {nav.links[k]}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div
        className={`container-x flex flex-col gap-4 border-t border-line pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 transition-opacity delay-200 duration-700 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <LangSwitcher locale={locale} label={languageLabel} legalKey={legalKey} size="lg" className="-ml-3" />
        <ContactButton href={sectionHref(locale, 'contact')} onOpen={onClose} className="btn btn-primary w-full">
          {nav.cta}
        </ContactButton>
      </div>
    </div>
  );
}
