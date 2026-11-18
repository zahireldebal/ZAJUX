import type { MetadataRoute } from 'next';
import { LEGAL_KEYS, LOCALES, routePath, type RouteKey } from '@/i18n/config';
import { SITE_URL, LEGAL_UPDATED } from '@/data/business';
import { hreflangAlternates } from '@/lib/seo';
import { navPages } from '@/lib/nav';

export const dynamic = 'force-static';

/** Sitemap con alternates hreflang (es, pt-BR, en, x-default) para cada página. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: RouteKey[] = ['home', ...navPages(), ...LEGAL_KEYS];
  const legal = (r: RouteKey) => (LEGAL_KEYS as readonly string[]).includes(r);
  return routes.flatMap((route) =>
    LOCALES.map((l) => ({
      url: `${SITE_URL}${routePath(l, route)}`,
      lastModified: new Date(`${LEGAL_UPDATED}T00:00:00Z`),
      changeFrequency: legal(route) ? ('yearly' as const) : ('monthly' as const),
      priority: route === 'home' ? (l === 'en' ? 0.9 : 1) : legal(route) ? 0.3 : 0.8,
      alternates: { languages: hreflangAlternates(route) },
    })),
  );
}
