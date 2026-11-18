import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { Arrow } from '@/components/ui/Arrow';
import { ContactButton } from '@/components/contact/ContactButton';
import type { PlanId } from '@/components/contact/ContactProvider';
import { SECTION_IDS, sectionHref, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export function Plans({ locale, t, index }: { locale: Locale; t: Dictionary; index: number }) {
  const p = t.plans;
  return (
    <section id={SECTION_IDS[locale].plans} aria-labelledby="plans-title" className="section-y relative" tabIndex={-1}>
      <div className="container-x">
        <SectionHeading index={index} eyebrow={p.eyebrow} title={p.title} intro={p.intro} id="plans-title" />
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 xl:grid-cols-4" data-reveal-group>
          {p.items.map((plan, i) => (
            <li key={plan.id} data-reveal-item className="card card-hover flex flex-col p-6 lg:p-7">
              <div className="flex items-center justify-between">
                <span className="label-mono text-faint">{`0${i + 1}`}</span>
                <span className="label-mono rounded-full border border-line px-3 py-1 text-[0.68rem] text-lime">{p.price}</span>
              </div>
              <h3 className="mt-8 text-h3 font-medium">{plan.name}</h3>

              <p className="label-mono mt-6 text-[0.68rem] text-faint">{p.forLabel}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-mute">{plan.for}</p>

              <p className="label-mono mt-6 text-[0.68rem] text-faint">{p.includesLabel}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {plan.includes.map((inc) => (
                  <li key={inc} className="flex gap-2.5">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-lime" />
                    {inc}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <ContactButton
                  href={sectionHref(locale, 'contact')}
                  plan={plan.id as PlanId}
                  className="btn btn-ghost w-full justify-between"
                >
                  {p.cta}
                  <span className="sr-only">: {plan.name}</span>
                  <Arrow />
                </ContactButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
