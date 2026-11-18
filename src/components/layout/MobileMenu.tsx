'use client';

import { useEffect, useRef } from 'react';
import { ContactButton } from '@/components/contact/ContactButton';
import { LangSwitcher } from './LangSwitcher';
import { contactHref, pagePath, type Locale, type PageKey, type RouteKey } from '@/i18n/config';
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
  route,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  nav: Dictionary['nav'];
  languageLabel: string;
  links: PageKey[];
  route: RouteKey;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useFocusTrap(panel, open, onClose, '#menu-toggle');

  // Cerrar si la pantalla pasa a desktop
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 64rem)');
    const fn = () => mq.matches && onClose();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [open, onClose]);

  const items = [
    ...links.map((k) => ({ key: k, href: pagePath(locale, k), label: nav.links[k], current: route === k })),
    { key: 'contact', href: contactHref(locale), label: nav.links.contact, current: false },
  ];

  return (
    <div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={nav.label}
      inert={!open}
      className={`fixed inset-0 z-40 flex flex-col bg-ink/95 pt-20 backdrop-blur-xl transition-[opacity,visibility] duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <nav aria-label={nav.label} className="container-x flex-1 overflow-y-auto py-6">
        <ul className="flex flex-col">
          {items.map((it, i) => (
            <li
              key={it.key}
              className={`transition-[transform,opacity] duration-700 ease-[var(--ease-out-expo)] ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
            >
              <a
                href={it.href}
                onClick={onClose}
                aria-current={it.current ? 'page' : undefined}
                className={`flex min-h-14 items-center py-2 text-[2rem] font-semibold tracking-tight ${it.current ? 'text-lime' : 'text-paper'}`}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className={`container-x flex flex-col gap-4 border-t border-line pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 transition-opacity delay-200 duration-700 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <LangSwitcher locale={locale} label={languageLabel} route={route} size="lg" className="-ml-3" />
        <ContactButton href={contactHref(locale)} onOpen={onClose} className="btn btn-primary w-full">
          {nav.cta}
        </ContactButton>
      </div>
    </div>
  );
}
