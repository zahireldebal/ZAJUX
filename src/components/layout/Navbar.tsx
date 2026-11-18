'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLogo } from '@/components/brand/NavLogo';
import { ContactButton } from '@/components/contact/ContactButton';
import { LangSwitcher } from './LangSwitcher';
import { MobileMenu } from './MobileMenu';
import { useActiveSection } from '@/lib/activeSection';
import { homePath, sectionHref, type LegalKey, type Locale, type SectionKey } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export interface NavProps {
  locale: Locale;
  nav: Dictionary['nav'];
  common: Pick<Dictionary['common'], 'openMenu' | 'closeMenu' | 'language' | 'home'>;
  links: SectionKey[];
  legalKey?: LegalKey;
}

export function Navbar({ locale, nav, common, links, legalKey }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection();
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
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-out-expo)] ${
          showBar ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled && !menuOpen ? 'border-b border-line bg-ink/80 backdrop-blur-md' : 'border-b border-transparent'}`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <NavLogo href={homePath(locale)} label={common.home} />

          <nav aria-label={nav.label} className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {links.map((k) => (
                <li key={k}>
                  <a
                    href={legalKey ? sectionHref(locale, k) : sectionHref(locale, k).replace(homePath(locale), '')}
                    aria-current={active === k ? 'true' : undefined}
                    className={`link-grow inline-flex min-h-11 items-center text-[0.95rem] transition-colors duration-300 ${
                      active === k ? 'text-paper' : 'text-mute hover:text-paper'
                    }`}
                  >
                    {nav.links[k]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <LangSwitcher locale={locale} label={common.language} legalKey={legalKey} />
            <ContactButton href={sectionHref(locale, 'contact')} className="btn btn-primary hidden !min-h-11 !px-5 !text-sm md:inline-flex">
              {nav.cta}
            </ContactButton>
            <button
              type="button"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg lg:hidden"
              aria-expanded={menuOpen}
              id="menu-toggle"
              aria-controls="mobile-menu"
              aria-label={menuOpen ? common.closeMenu : common.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-6" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-6 bg-paper transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    menuOpen ? 'translate-y-[5.25px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-paper transition-[transform,width] duration-500 ease-[var(--ease-out-expo)] ${
                    menuOpen ? 'w-6 -translate-y-[5.25px] -rotate-45' : 'w-4'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        locale={locale}
        nav={nav}
        languageLabel={common.language}
        links={links}
        legalKey={legalKey}
      />
    </>
  );
}
