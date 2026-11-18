import { MARK } from './logo-data';

/** Isotipo de ZAJUX (Z con diagonal lima entre chevrons), opcionalmente dentro del cuadrado redondeado. */
export function Isotype({ boxed = true, className = 'size-9', chevrons = true }: { boxed?: boolean; className?: string; chevrons?: boolean }) {
  const d = MARK.diagonal;
  const inner = (
    <>
      {chevrons && (
        <g fill="none" stroke="#6B7280" strokeWidth={MARK.chevW} strokeLinecap="round" strokeLinejoin="round">
          <polyline points={MARK.chevL} />
          <polyline points={MARK.chevR} />
        </g>
      )}
      {MARK.bars.map((b) => (
        <rect key={b.y} x={b.x} y={b.y} width={b.w} height={b.h} fill="#F5F5F7" />
      ))}
      <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="#C6F432" strokeWidth={d.w} />
    </>
  );
  if (!boxed) {
    return (
      <svg viewBox="-76 -46 152 92" className={className} aria-hidden="true" focusable="false">
        {inner}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 173 173" className={className} aria-hidden="true" focusable="false">
      <rect width="173" height="173" rx="38" fill="#161617" />
      <g transform="translate(86.5 86.5)">{inner}</g>
    </svg>
  );
}
