import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  LEGAL_KEYS,
  LEGAL_SLUGS,
  PAGE_SLUGS,
  isLocale,
  legalKeyFromSlug,
  pageKeyFromSlug,
  type LegalKey,
  type Locale,
  type PageKey,
} from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { getLegal } from '@/i18n/legal';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { navPages } from '@/lib/nav';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { LegalArticle } from '@/components/pages/LegalArticle';
import { ContentPage } from '@/components/pages/ContentPage';
import { buildMetadata } from '@/lib/seo';

export const dynamicParams = false;

/** Páginas de contenido (servicios, proceso, planes…) y páginas legales, con slugs por idioma. */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  const locale: Locale = params.locale;
  return [...navPages().map((k) => PAGE_SLUGS[locale][k]), ...LEGAL_KEYS.map((k) => LEGAL_SLUGS[locale][k])].map((slug) => ({ slug }));
}

type Params = { params: Promise<{ locale: string; slug: string }> };
type Resolved = { locale: Locale; kind: 'page'; key: PageKey } | { locale: Locale; kind: 'legal'; key: LegalKey };

function resolve(locale: string, slug: string): Resolved | null {
  if (!isLocale(locale)) return null;
  const page = pageKeyFromSlug(locale, slug);
  if (page && navPages().includes(page)) return { locale, kind: 'page', key: page };
  const legal = legalKeyFromSlug(locale, slug);
  return legal ? { locale, kind: 'legal', key: legal } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const r = resolve(locale, slug);
  if (!r) return {};
  const t = getDictionary(r.locale);
  if (r.kind === 'page') {
    return buildMetadata(r.locale, { route: r.key, title: t.nav.links[r.key], description: t.meta.pages[r.key] });
  }
  return buildMetadata(r.locale, { route: r.key, title: t.legal.titles[r.key], description: getLegal(r.locale)[r.key].description });
}

export default async function SlugPage({ params }: Params) {
  const { locale: l, slug } = await params;
  const r = resolve(l, slug);
  if (!r) notFound();
  return (
    <SiteChrome locale={r.locale} route={r.key}>
      <MotionProvider />
      {r.kind === 'page' ? <ContentPage locale={r.locale} page={r.key} /> : <LegalArticle locale={r.locale} legalKey={r.key} />}
    </SiteChrome>
  );
}
