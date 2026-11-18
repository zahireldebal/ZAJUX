import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';
import { getDictionary } from '@/i18n';
import { isLegalKey, type Locale, type RouteKey } from '@/i18n/config';
import { navPages } from '@/lib/nav';
import { ContactModal } from '@/components/contact/ContactModal';
import { FloatingCta } from '@/components/contact/FloatingCta';

export function SiteChrome({ locale, route, children }: { locale: Locale; route: RouteKey; children: ReactNode }) {
  const dict = getDictionary(locale);
  const links = navPages();
  return (
    <>
      <SkipLink label={dict.common.skipToContent} />
      <Navbar
        locale={locale}
        nav={dict.nav}
        common={{ openMenu: dict.common.openMenu, closeMenu: dict.common.closeMenu, language: dict.common.language, home: dict.common.home }}
        links={links}
        route={route}
      />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer locale={locale} dict={dict} links={links} route={route} />
      {!isLegalKey(route) && <FloatingCta locale={locale} label={dict.floating.cta} />}
      <ContactModal closeLabel={dict.common.close} />
    </>
  );
}
