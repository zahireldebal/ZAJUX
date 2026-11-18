import type { ReactNode } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactButton } from '@/components/contact/ContactButton';
import type { PlanId } from '@/components/contact/ContactProvider';
import { Arrow } from '@/components/ui/Arrow';
import { BookingDemo } from '@/components/demos/BookingDemo';
import { WhatsAppDemo } from '@/components/demos/WhatsAppDemo';
import { BeforeAfterDemo } from '@/components/demos/BeforeAfterDemo';
import { HREFLANG, SECTION_IDS, sectionHref, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

function DemoCard({
  n,
  title,
  desc,
  badge,
  pitch,
  cta,
  href,
  plan,
  children,
}: {
  n: number;
  title: string;
  desc: string;
  badge: string;
  pitch: string;
  cta: string;
  href: string;
  plan?: PlanId;
  children: ReactNode;
}) {
  return (
    <li data-reveal-item className="card flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-5 pb-0 sm:p-6 sm:pb-0">
        <div>
          <p className="label-mono text-[0.68rem] text-chevron">{`0${n} /`}</p>
          <h3 className="mt-2 text-h3 font-medium">{title}</h3>
          <p className="mt-1.5 text-sm text-mute">{desc}</p>
        </div>
        <span className="label-mono shrink-0 rounded-full border border-lime/50 px-2.5 py-1 text-[0.62rem] text-lime">{badge}</span>
      </div>
      <div className="m-3 flex min-h-[25rem] flex-1 flex-col rounded-2xl border border-line bg-ink p-4 sm:m-4 sm:p-5">{children}</div>
      <div className="flex flex-col gap-3 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-sm">{pitch}</p>
        <ContactButton href={href} plan={plan} className="btn btn-primary !min-h-11 shrink-0 !px-4 !text-sm">
          {cta}
          <Arrow />
        </ContactButton>
      </div>
    </li>
  );
}

export function Demos({ locale, t, index }: { locale: Locale; t: Dictionary; index: number }) {
  const d = t.demos;
  const href = sectionHref(locale, 'contact');
  const common = { badge: t.common.demo, pitch: d.pitch, cta: d.cta, href };
  return (
    <section id={SECTION_IDS[locale].demos} aria-labelledby="demos-title" className="section-y relative" tabIndex={-1}>
      <div className="container-x">
        <SectionHeading index={index} eyebrow={d.eyebrow} title={d.title} intro={d.intro} id="demos-title" />
        <ul className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-2 xl:grid-cols-3" data-reveal-group>
          <DemoCard n={1} title={d.booking.title} desc={d.booking.desc} plan="booking" {...common}>
            <BookingDemo t={d.booking} lang={HREFLANG[locale]} />
          </DemoCard>
          <DemoCard n={2} title={d.whatsapp.title} desc={d.whatsapp.desc} {...common}>
            <WhatsAppDemo t={d.whatsapp} />
          </DemoCard>
          <DemoCard n={3} title={d.beforeAfter.title} desc={d.beforeAfter.desc} plan="brand" {...common}>
            <BeforeAfterDemo t={d.beforeAfter} />
          </DemoCard>
        </ul>
      </div>
    </section>
  );
}
