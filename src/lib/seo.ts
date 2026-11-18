import type { Metadata } from 'next';
import { HREFLANG, LOCALES, OG_LOCALE, homePath, legalPath, type LegalKey, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { SITE_URL } from '@/data/business';

/** Ruta de una página (inicio o legal) en un idioma. */
export const pagePath = (locale: Locale, legalKey?: LegalKey) => (legalKey ? legalPath(locale, legalKey) : homePath(locale));

/** Alternates hreflang (es, pt-BR, en, x-default) para una página. */
export function hreflangAlternates(legalKey?: LegalKey) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = `${SITE_URL}${pagePath(l, legalKey)}`;
  languages['x-default'] = legalKey ? `${SITE_URL}${pagePath('en', legalKey)}` : `${SITE_URL}/`;
  return languages;
}

export function buildMetadata(locale: Locale, opts: { legalKey?: LegalKey; title?: string; description?: string } = {}): Metadata {
  const d = getDictionary(locale);
  const title = opts.title ? `${opts.title} · ZAJUX` : d.meta.title;
  const description = opts.description ?? d.meta.description;
  const url = `${SITE_URL}${pagePath(locale, opts.legalKey)}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: opts.legalKey ? undefined : d.meta.keywords,
    authors: [{ name: 'Juani Hermelo' }, { name: 'Zahir El Debal' }],
    creator: 'ZAJUX',
    alternates: { canonical: url, languages: hreflangAlternates(opts.legalKey) },
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
