import { SectionHeading, sectionClass } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/i18n';

export function Why({ t, level = 2 }: { t: Dictionary; level?: 1 | 2 }) {
  const w = t.why;
  return (
    <section aria-labelledby="why-title" className={`${sectionClass(level)} band`}>
      <div className="container-x">
        <SectionHeading eyebrow={w.eyebrow} title={w.title} id="why-title" level={level} align="stack" />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3" data-reveal-group>
          {w.items.map((item) => (
            <li key={item.title} data-reveal-item className="tile tile-dark tile-hover group relative overflow-hidden p-7 sm:p-8 lg:p-10">
              <span
                aria-hidden="true"
                className="block h-[3px] w-8 rounded-full bg-lime transition-[width] duration-700 ease-[var(--ease-out-expo)] group-hover:w-16"
              />
              <h3 className="mt-8 text-h3 font-semibold lg:mt-12">{item.title}</h3>
              <p className="mt-3 max-w-sm text-mute">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
