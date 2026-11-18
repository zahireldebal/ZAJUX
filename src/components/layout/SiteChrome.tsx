import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';
import { getDictionary } from '@/i18n';
import type { LegalKey, Locale, SectionKey } from '@/i18n/config';
import { projectsVisible } from '@/data/projects';
import { ContactModal } from '@/components/contact/ContactModal';
import { FloatingCta } from '@/components/contact/FloatingCta';

/** Secciones que aparecen en el menú (Proyectos solo si el portafolio está activo). */
export function navSections(): SectionKey[] {
  const base: SectionKey[] = ['services', 'demos', 'process', 'plans', 'about', 'faq'];
  if (projectsVisible()) base.splice(5, 0, 'projects');
  return base;
}

export function SiteChrome({ locale, legalKey, children }: { locale: Locale; legalKey?: LegalKey; children: ReactNode }) {
  const dict = getDictionary(locale);
  const links = navSections();
  return (
    <>
      <SkipLink label={dict.common.skipToContent} />
      <Navbar
        locale={locale}
        nav={dict.nav}
        common={{ openMenu: dict.common.openMenu, closeMenu: dict.common.closeMenu, language: dict.common.language, home: dict.common.home }}
        links={links}
        legalKey={legalKey}
      />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer locale={locale} dict={dict} links={links} legalKey={legalKey} />
      {!legalKey && <FloatingCta locale={locale} label={dict.floating.cta} />}
      <ContactModal closeLabel={dict.common.close} />
    </>
  );
}
