/** Banderas simplificadas en SVG (sin emojis, que se ven distinto en cada sistema). */
export function Flag({ code, label, className = 'h-4 w-6' }: { code: 'UY' | 'BR'; label: string; className?: string }) {
  if (code === 'UY') {
    return (
      <svg viewBox="0 0 27 18" className={`${className} shrink-0 rounded-[2px]`} role="img" aria-label={label}>
        <rect width="27" height="18" fill="#fff" />
        {[2, 6, 10, 14].map((y) => (
          <rect key={y} y={y} width="27" height="2" fill="#0038A8" />
        ))}
        <rect width="10" height="10" fill="#fff" />
        <circle cx="5" cy="5" r="2.2" fill="#FCD116" stroke="#7B3F00" strokeWidth="0.3" />
        <g stroke="#FCD116" strokeWidth="0.7">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={5 + Math.cos(a) * 2.6} y1={5 + Math.sin(a) * 2.6} x2={5 + Math.cos(a) * 4.2} y2={5 + Math.sin(a) * 4.2} />;
          })}
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 27 18" className={`${className} shrink-0 rounded-[2px]`} role="img" aria-label={label}>
      <rect width="27" height="18" fill="#009C3B" />
      <path d="M13.5 2 25 9 13.5 16 2 9z" fill="#FFDF00" />
      <circle cx="13.5" cy="9" r="4" fill="#002776" />
      <path d="M9.6 8.2c2.6-.4 5.4.2 7.7 1.6" stroke="#fff" strokeWidth="0.7" fill="none" />
    </svg>
  );
}
