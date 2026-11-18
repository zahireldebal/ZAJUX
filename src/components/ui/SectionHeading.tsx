import type { ReactNode } from 'react';

/**
 * Encabezado de sección: etiqueta lima, título que se revela por líneas e introducción.
 * En la primera sección de una página el título es h1; en las demás, h2.
 * En desktop ("split"), título a la izquierda e intro a la derecha.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  level = 2,
  align = 'split',
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  id: string;
  level?: 1 | 2;
  align?: 'split' | 'stack';
  children?: ReactNode;
}) {
  const Title = level === 1 ? 'h1' : 'h2';
  return (
    <header
      className={
        align === 'split'
          ? 'grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10'
          : 'flex max-w-3xl flex-col gap-6'
      }
    >
      <div className={align === 'split' ? 'lg:col-span-7' : ''}>
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
        <Title id={id} className={`mt-4 font-semibold ${level === 1 ? 'text-h1' : 'text-h2'}`} data-split>
          {title}
        </Title>
      </div>
      {(intro || children) && (
        <div className={align === 'split' ? 'lg:col-span-5 lg:pb-2' : ''} data-reveal>
          {intro && <p className="max-w-xl text-lead text-mute">{intro}</p>}
          {children}
        </div>
      )}
    </header>
  );
}

/** Espaciado de una sección: la primera de cada página deja lugar para la barra de navegación. */
export const sectionClass = (level: 1 | 2) => `${level === 1 ? 'section-first' : 'section-y'} relative`;
