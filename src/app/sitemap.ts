import type { MetadataRoute } from 'next';
import { LEGAL_KEYS, LOCALES } from '@/i18n/config';
import { SITE_URL, LEGAL_UPDATED } from '@/data/business';
import { pagePath, hreflangAlternates } from '@/lib/seo';

export const dynamic = 'force-static';

/** Sitemap con alternates hreflang (es, pt-BR, en, x-default) para cada página. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: (undefined | (typeof LEGAL_KEYS)[number])[] = [undefined, ...LEGAL_KEYS];
  return pages.flatMap((legalKey) =>
    LOCALES.map((l) => ({
      url: `${SITE_URL}${pagePath(l, legalKey)}`,
      lastModified: new Date(`${LEGAL_UPDATED}T00:00:00Z`),
      changeFrequency: legalKey ? ('yearly' as const) : ('monthly' as const),
      priority: legalKey ? 0.3 : l === 'en' ? 0.9 : 1,
      alternates: { languages: hreflangAlternates(legalKey) },
    })),
  );
}
