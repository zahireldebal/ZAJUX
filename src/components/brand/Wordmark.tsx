import type { ReactNode, Ref } from 'react';
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
  shock?: Ref<HTMLSpanElement>;
  /** Recibe cada copia de la estela (en orden: la más cercana primero). */
  ghost?: (i: number, el: HTMLSpanElement | null) => void;
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
  ghosts = 0,
  back,
  front,
}: {
  className?: string;
  refs?: WordmarkRefs;
  idPrefix?: string;
  flash?: boolean;
  /** Cantidad de copias de la estela (solo el logo grande del hero). */
  ghosts?: number;
  /** Capas extra detrás y delante de las letras (por ejemplo, las dos mitades del anillo). */
  back?: ReactNode;
  front?: ReactNode;
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
  const xStyle = { left: `${xBox.left}%`, top: `${xBox.top}%`, width: `${xBox.width}%`, height: `${xBox.height}%` };

  return (
    <span
      ref={refs?.root}
      className={`wordmark relative inline-block align-middle ${className}`}
      style={{ aspectRatio: `${W} / ${H}` }}
      aria-hidden="true"
    >
      {back}

      {Array.from({ length: ghosts }, (_, i) => (
        <span
          key={i}
          ref={(el) => refs?.ghost?.(i, el)}
          className="wordmark-ghost pointer-events-none absolute z-[1] block opacity-0"
          style={xStyle}
        >
          <svg viewBox={xView} className="absolute inset-0 h-full w-full" focusable="false">
            <path d={X.d} fill="#C6F432" />
          </svg>
        </span>
      ))}

      <svg
        ref={refs?.letters}
        viewBox={`0 0 ${W} ${H}`}
        className="wordmark-letters absolute inset-0 z-[2] h-full w-full overflow-visible"
        focusable="false"
      >
        {ZAJU.map((l) => (
          <path key={l.char} d={l.d} fill="#F5F5F7" data-letter={l.char} />
        ))}
      </svg>

      {front}

      <span ref={refs?.x} className="wordmark-x absolute z-[3] block" style={xStyle}>
        {flash && (
          <span
            ref={refs?.shock}
            className="wordmark-shock pointer-events-none absolute left-1/2 top-1/2 block aspect-square h-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lime opacity-0"
          />
        )}
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
  /** Centro vertical de la X (para ubicar el anillo de la órbita). */
  xMiddle: X_BOX.y + X_BOX.h / 2,
  zajuCenter: (ZAJU[0]!.box.x + ZAJU[3]!.box.x + ZAJU[3]!.box.w) / 2,
};
