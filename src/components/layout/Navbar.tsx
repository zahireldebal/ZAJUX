'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLogo } from '@/components/brand/NavLogo';
import { ContactButton } from '@/components/contact/ContactButton';
import { LangSwitcher } from './LangSwitcher';
import { MobileMenu } from './MobileMenu';
import { contactHref, homePath, pagePath, type Locale, type PageKey, type RouteKey } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export interface NavProps {
  locale: Locale;
  nav: Dictionary['nav'];
  common: Pick<Dictionary['common'], 'openMenu' | 'closeMenu' | 'language' | 'home'>;
  links: PageKey[];
  route: RouteKey;
}

/**
 * Barra flotante con vidrio esmerilado: cada opción abre su página.
 * Se esconde al bajar y vuelve al subir.
 */
export function Navbar({ locale, nav, common, links, route }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        const delta = y - lastY.current;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 320);
          lastY.current = y;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const showBar = !hidden || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-700 ease-[var(--ease-out-expo)] sm:px-4 ${
          showBar ? 'translate-y-0' : '-translate-y-[120%]'
        }`}
      >
        <div
          className={`nav-glass mx-auto flex h-14 max-w-[78rem] items-center justify-between gap-4 rounded-[1.25rem] pl-4 pr-2 transition-[background-color,box-shadow] duration-500 sm:pl-5 ${
            scrolled || menuOpen ? 'nav-glass--solid' : ''
          }`}
        >
          <NavLogo href={homePath(locale)} label={common.home} />

          <nav aria-label={nav.label} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((k) => (
                <li key={k}>
                  <a
                    href={pagePath(locale, k)}
                    aria-current={route === k ? 'page' : undefined}
                    className={`nav-link ${route === k ? 'nav-link--active' : ''}`}
                  >
                    {nav.links[k]}
                  </a>
                </li>
              ))}
              <li>
                <a href={contactHref(locale)} className="nav-link">
                  {nav.links.contact}
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LangSwitcher locale={locale} label={common.language} route={route} />
            <ContactButton href={contactHref(locale)} className="btn btn-primary hidden !min-h-10 !px-4 !text-[0.8125rem] md:inline-flex">
              {nav.cta}
            </ContactButton>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full lg:hidden"
              aria-expanded={menuOpen}
              id="menu-toggle"
              aria-controls="mobile-menu"
              aria-label={menuOpen ? common.closeMenu : common.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-paper transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    menuOpen ? 'translate-y-[5.25px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] rounded-full bg-paper transition-[transform,width] duration-500 ease-[var(--ease-out-expo)] ${
                    menuOpen ? 'w-5 -translate-y-[5.25px] -rotate-45' : 'w-3.5'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} locale={locale} nav={nav} languageLabel={common.language} links={links} route={route} />
    </>
  );
}
