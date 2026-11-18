import { SectionHeading } from '@/components/ui/SectionHeading';
import { Arrow } from '@/components/ui/Arrow';
import { PROJECTS, projectsVisible } from '@/data/projects';
import { SECTION_IDS, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

/** Portafolio. No se renderiza mientras SHOW_PROJECTS sea false o la lista esté vacía. */
export function Projects({ locale, t, index }: { locale: Locale; t: Dictionary; index: number }) {
  if (!projectsVisible()) return null;
  const p = t.projects;
  return (
    <section id={SECTION_IDS[locale].projects} aria-labelledby="projects-title" className="section-y relative" tabIndex={-1}>
      <div className="container-x">
        <SectionHeading index={index} eyebrow={p.eyebrow} title={p.title} intro={p.intro} id="projects-title" />
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20" data-reveal-group>
          {PROJECTS.map((pr) => (
            <li key={pr.id} data-reveal-item className="card card-hover group overflow-hidden">
              <a href={pr.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="aspect-[16/10] overflow-hidden bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pr.image}
                    alt={pr.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-h3 font-medium">{pr.name}</h3>
                    <p className="mt-2 text-mute">{pr.description[locale]}</p>
                    <p className="label-mono mt-3 text-[0.68rem] text-faint">
                      {pr.year} · {pr.tags.join(' · ')}
                    </p>
                  </div>
                  <span className="label-mono inline-flex items-center gap-2 text-lime">
                    {p.visit}
                    <Arrow />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
