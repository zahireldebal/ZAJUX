import type { Ref } from 'react';
import { WORDMARK, X_BOX } from './logo-data';

const ZAJU = WORDMARK.letters.slice(0, 4);
const X = WORDMARK.letters[4]!;
const PAD = 6; // margen alrededor de la X para que el desenfoque no se corte

export interface WordmarkRefs {
  root?: Ref<HTMLSpanElement>;
  letters?: Ref<SVGSVGElement>;
  x?: Ref<HTMLSpanElement>;
  xSharp?: Ref<SVGSVGElement>;
  xBlur?: Ref<SVGSVGElement>;
  flash?: Ref<HTMLSpanElement>;
}

/**
 * Logotipo "ZAJUX" con trazos exactos. La X vive en su propia capa (posición absoluta)
 * para poder orbitar y pasar por delante o por detrás de "ZAJU".
 * El alto se controla con la clase (ej. "h-5"); el ancho sale de la proporción.
 */
export function Wordmark({
  className = 'h-5',
  refs,
  idPrefix = 'wm',
  flash = false,
}: {
  className?: string;
  refs?: WordmarkRefs;
  idPrefix?: string;
  flash?: boolean;
}) {
  const { width: W, height: H } = WORDMARK;
  const xBox = {
    left: ((X_BOX.x - PAD) / W) * 100,
    top: ((X_BOX.y - PAD) / H) * 100,
    width: ((X_BOX.w + PAD * 2) / W) * 100,
    height: ((X_BOX.h + PAD * 2) / H) * 100,
  };
  const xView = `${X_BOX.x - PAD} ${X_BOX.y - PAD} ${X_BOX.w + PAD * 2} ${X_BOX.h + PAD * 2}`;
  const filterId = `${idPrefix}-xblur`;

  return (
    <span
      ref={refs?.root}
      className={`wordmark relative inline-block align-middle ${className}`}
      style={{ aspectRatio: `${W} / ${H}` }}
      aria-hidden="true"
    >
      <svg
        ref={refs?.letters}
        viewBox={`0 0 ${W} ${H}`}
        className="wordmark-letters absolute inset-0 z-[2] h-full w-full overflow-visible"
        focusable="false"
      >
        {ZAJU.map((l) => (
          <path key={l.char} d={l.d} fill="#F5F4F0" data-letter={l.char} />
        ))}
      </svg>

      <span
        ref={refs?.x}
        className="wordmark-x absolute z-[3] block"
        style={{ left: `${xBox.left}%`, top: `${xBox.top}%`, width: `${xBox.width}%`, height: `${xBox.height}%` }}
      >
        {flash && (
          <span
            ref={refs?.flash}
            className="wordmark-flash pointer-events-none absolute left-1/2 top-1/2 block size-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
            style={{ background: 'radial-gradient(circle, rgb(198 244 50 / 0.55) 0%, rgb(198 244 50 / 0.14) 35%, transparent 68%)' }}
          />
        )}
        <svg ref={refs?.xSharp} viewBox={xView} className="absolute inset-0 h-full w-full" focusable="false">
          <path d={X.d} fill="#C6F432" />
        </svg>
        <svg ref={refs?.xBlur} viewBox={xView} className="absolute inset-0 h-full w-full opacity-0" focusable="false">
          <defs>
            <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" />
            </filter>
          </defs>
          <path d={X.d} fill="#C6F432" filter={`url(#${filterId})`} />
        </svg>
      </span>
    </span>
  );
}

/** Centros útiles para calcular la órbita (en unidades del viewBox). */
export const WORD_METRICS = {
  width: WORDMARK.width,
  height: WORDMARK.height,
  xCenter: X_BOX.x + X_BOX.w / 2,
  zajuCenter: (ZAJU[0]!.box.x + ZAJU[3]!.box.x + ZAJU[3]!.box.w) / 2,
};
