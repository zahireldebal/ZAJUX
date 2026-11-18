import type { ReactNode } from 'react';

/**
 * Encabezado de sección: numeración tipo "01 /", título que se revela por líneas
 * e introducción. En desktop, título a la izquierda e intro a la derecha.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  id,
  align = 'split',
  children,
}: {
  index: number;
  eyebrow: string;
  title: string;
  intro?: string;
  id: string;
  align?: 'split' | 'stack';
  children?: ReactNode;
}) {
  return (
    <header
      className={
        align === 'split'
          ? 'grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10'
          : 'flex max-w-3xl flex-col gap-6'
      }
    >
      <div className={align === 'split' ? 'lg:col-span-7' : ''}>
        <p className="label-mono flex items-center gap-3 text-mute" data-reveal>
          <span className="text-lime">{String(index).padStart(2, '0')} /</span>
          {eyebrow}
          <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
        </p>
        <h2 id={id} className="mt-5 text-h2 font-semibold" data-split>
          {title}
        </h2>
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
