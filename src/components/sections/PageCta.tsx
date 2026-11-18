import { ContactButton } from '@/components/contact/ContactButton';
import { Arrow } from '@/components/ui/Arrow';
import { contactHref, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

/** Cierre de cada página de contenido: invita a escribir (abre el formulario). */
export function PageCta({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="page-cta-title" className="section-y relative">
      <div className="container-x">
        <div className="cta-panel relative isolate overflow-hidden rounded-[var(--radius-card)] px-6 py-16 text-center sm:px-10 lg:py-24" data-reveal>
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute left-1/2 top-full -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <h2 id="page-cta-title" className="mx-auto max-w-[20ch] text-h2 font-semibold">
            {t.pageCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lead text-mute">{t.pageCta.text}</p>
          <ContactButton href={contactHref(locale)} className="btn btn-primary mt-9">
            {t.nav.cta}
            <Arrow />
          </ContactButton>
        </div>
      </div>
    </section>
  );
}
