import { SectionHeading } from '@/components/ui/SectionHeading';
import { LazyContactForm } from '@/components/contact/LazyContactForm';
import { PersonCards } from '@/components/contact/PersonCards';
import { SECTION_IDS, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export function Contact({ locale, t, index }: { locale: Locale; t: Dictionary; index: number }) {
  const c = t.contact;
  return (
    <section id={SECTION_IDS[locale].contact} aria-labelledby="contact-title" className="section-y relative overflow-x-clip" tabIndex={-1}>
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[50vmax] w-[50vmax] -translate-x-1/2 rounded-full opacity-60" />
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading index={index} eyebrow={c.eyebrow} title={c.title} intro={c.intro} id="contact-title" align="stack" />
          </div>
        </div>
        <div className="flex flex-col gap-10 lg:col-span-8">
          <div className="card p-5 sm:p-8 lg:p-10" data-reveal>
            <LazyContactForm idPrefix="section" />
          </div>
          <div data-reveal>
            <PersonCards locale={locale} t={c} common={t.common} />
          </div>
        </div>
      </div>
    </section>
  );
}
