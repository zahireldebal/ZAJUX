import { notFound } from 'next/navigation';
import { SECTION_IDS, SECTION_KEYS, isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { SectionObserver } from '@/components/layout/SectionObserver';
import { Hero } from '@/components/sections/Hero';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <SiteChrome locale={locale}>
      <SectionObserver locale={locale} />
      <Hero locale={locale} t={t} />
      {SECTION_KEYS.filter((k) => k !== 'projects').map((k, i) => (
        <section key={k} id={SECTION_IDS[locale][k]} className="container-x section-y border-t border-line">
          <p className="label-mono text-mute">
            {String(i + 1).padStart(2, '0')} / {t.nav.links[k]}
          </p>
          <div className="h-[60vh]" />
        </section>
      ))}
    </SiteChrome>
  );
}
