import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { Hero } from '@/components/sections/Hero';
import { Contact } from '@/components/sections/Contact';
import { organizationJsonLd } from '@/lib/jsonld';

/** Inicio: la pantalla del logo y el contacto. El resto del sitio está en páginas propias. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteChrome locale={locale} route="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)).replace(/</g, '\u003c') }}
      />
      <MotionProvider />
      <Hero locale={locale} t={t} />
      <Contact locale={locale} t={t} />
    </SiteChrome>
  );
}
