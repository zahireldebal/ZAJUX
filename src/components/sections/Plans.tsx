import { SectionHeading, sectionClass } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { Arrow } from '@/components/ui/Arrow';
import { ContactButton } from '@/components/contact/ContactButton';
import type { PlanId } from '@/components/contact/ContactProvider';
import { contactHref, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

export function Plans({ locale, t, level = 2 }: { locale: Locale; t: Dictionary; level?: 1 | 2 }) {
  const p = t.plans;
  return (
    <section aria-labelledby="plans-title" className={sectionClass(level)}>
      <div className="container-x">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} id="plans-title" level={level} />
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 xl:grid-cols-4" data-reveal-group>
          {p.items.map((plan) => (
            <li key={plan.id} data-reveal-item className="tile tile-hover flex flex-col p-7 lg:p-8">
              <span className="caption w-fit rounded-full bg-ink px-3.5 py-1.5 text-lime">{p.price}</span>
              <h3 className="mt-8 text-h3 font-semibold">{plan.name}</h3>

              <p className="caption mt-6 text-faint">{p.forLabel}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-mute">{plan.for}</p>

              <p className="caption mt-6 text-faint">{p.includesLabel}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {plan.includes.map((inc) => (
                  <li key={inc} className="flex gap-2.5">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-lime" />
                    {inc}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <ContactButton href={contactHref(locale)} plan={plan.id as PlanId} className="btn btn-ghost w-full justify-between">
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
