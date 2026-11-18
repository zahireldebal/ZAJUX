import { notFound } from 'next/navigation';
import { SECTION_IDS, isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { SectionObserver } from '@/components/layout/SectionObserver';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Why } from '@/components/sections/Why';
import { Plans } from '@/components/sections/Plans';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Faq } from '@/components/sections/Faq';
import { projectsVisible } from '@/data/projects';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = projectsVisible() ? 1 : 0;

  return (
    <SiteChrome locale={locale}>
      <MotionProvider />
      <SectionObserver locale={locale} />
      <Hero locale={locale} t={t} />
      <Services locale={locale} t={t} index={1} />
      <section id={SECTION_IDS[locale].demos} className="section-y" tabIndex={-1}>
        <div className="container-x">
          <SectionHeading index={2} eyebrow={t.demos.eyebrow} title={t.demos.title} intro={t.demos.intro} id="demos-title" />
        </div>
      </section>
      <Process locale={locale} t={t.process} index={3} />
      <Why locale={locale} t={t} index={4} />
      <Plans locale={locale} t={t} index={5} />
      <About locale={locale} t={t} index={6} />
      <Projects locale={locale} t={t} index={7} />
      <Faq locale={locale} t={t.faq} index={7 + p} />
      <section id={SECTION_IDS[locale].contact} className="section-y" tabIndex={-1}>
        <div className="container-x">
          <SectionHeading index={8 + p} eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} id="contact-title" />
        </div>
      </section>
    </SiteChrome>
  );
}
