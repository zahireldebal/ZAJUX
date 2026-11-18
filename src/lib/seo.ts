import type { Metadata } from 'next';
import { HREFLANG, LOCALES, OG_LOCALE, routePath, type Locale, type RouteKey } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { SITE_URL } from '@/data/business';

/** Alternates hreflang (es, pt-BR, en, x-default) para una página. */
export function hreflangAlternates(route: RouteKey = 'home') {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = `${SITE_URL}${routePath(l, route)}`;
  // En el inicio, x-default es la raíz (detecta el idioma); en el resto, la versión en inglés.
  languages['x-default'] = route === 'home' ? `${SITE_URL}/` : `${SITE_URL}${routePath('en', route)}`;
  return languages;
}

export function buildMetadata(locale: Locale, opts: { route?: RouteKey; title?: string; description?: string } = {}): Metadata {
  const d = getDictionary(locale);
  const route = opts.route ?? 'home';
  const title = opts.title ? `${opts.title} · ZAJUX` : d.meta.title;
  const description = opts.description ?? d.meta.description;
  const url = `${SITE_URL}${routePath(locale, route)}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: route === 'home' ? d.meta.keywords : undefined,
    authors: [{ name: 'Juani Hermelo' }, { name: 'Zahir El Debal' }],
    creator: 'ZAJUX',
    alternates: { canonical: url, languages: hreflangAlternates(route) },
    openGraph: {
      type: 'website',
      siteName: 'ZAJUX',
      url,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`/og/og-${locale}.png`] },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/icons/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
  };
}
