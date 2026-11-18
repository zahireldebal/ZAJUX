import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { SectionObserver } from '@/components/layout/SectionObserver';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Why } from '@/components/sections/Why';
import { Plans } from '@/components/sections/Plans';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';
import { projectsVisible } from '@/data/projects';
import { organizationJsonLd } from '@/lib/jsonld';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = projectsVisible() ? 1 : 0;

  return (
    <SiteChrome locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)).replace(/</g, '\\u003c') }}
      />
      <MotionProvider />
      <SectionObserver locale={locale} />
      <Hero locale={locale} t={t} />
      <Services locale={locale} t={t} index={1} />
      <Process locale={locale} t={t.process} index={3} />
      <Why locale={locale} t={t} index={4} />
      <Plans locale={locale} t={t} index={5} />
      <About locale={locale} t={t} index={6} />
      <Projects locale={locale} t={t} index={7} />
      <Faq locale={locale} t={t.faq} index={7 + p} />
      <Contact locale={locale} t={t} index={8 + p} />
    </SiteChrome>
  );
}
