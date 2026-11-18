/** Íconos de línea propios (24×24, trazo 1.5). El acento lima marca el detalle clave. */
const ICONS = {
  web: (
    <>
      <rect x="2.75" y="4.25" width="18.5" height="15.5" rx="2.5" />
      <path d="M2.75 8.75h18.5" />
      <circle cx="5.75" cy="6.5" r=".6" fill="currentColor" stroke="none" />
      <circle cx="7.75" cy="6.5" r=".6" fill="currentColor" stroke="none" />
      <path d="m9.5 12.5-2 2 2 2M14.5 12.5l2 2-2 2" className="text-lime" stroke="currentColor" />
    </>
  ),
  booking: (
    <>
      <rect x="3.25" y="4.75" width="17.5" height="15.5" rx="2.5" />
      <path d="M3.25 9.25h17.5M8 3v3.5M16 3v3.5" />
      <path d="m9 14.5 2 2 4-4" className="text-lime" stroke="currentColor" />
    </>
  ),
  store: (
    <>
      <path d="M5 8.25h14l-1.1 10.6a2 2 0 0 1-2 1.8H8.1a2 2 0 0 1-2-1.8L5 8.25Z" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" className="text-lime" stroke="currentColor" />
    </>
  ),
  apps: (
    <>
      <rect x="6.75" y="2.75" width="10.5" height="18.5" rx="2.5" />
      <path d="M10.5 18h3" />
      <rect x="9.5" y="7" width="5" height="5" rx="1.2" className="text-lime" stroke="currentColor" />
    </>
  ),
  dashboards: (
    <>
      <rect x="2.75" y="3.75" width="18.5" height="16.5" rx="2.5" />
      <path d="M2.75 8.25h18.5M8.25 8.25v12" />
      <path d="m11 17 2.5-3 2 1.5 3-4" className="text-lime" stroke="currentColor" />
    </>
  ),
  automation: (
    <>
      <circle cx="6" cy="6" r="2.25" />
      <circle cx="18" cy="18" r="2.25" />
      <path d="M8.25 6H14a3 3 0 0 1 3 3v6.75" />
      <path d="M13 3.5 15.5 6 13 8.5" className="text-lime" stroke="currentColor" />
      <path d="M6 8.25V15a3 3 0 0 0 3 3h6.75" />
    </>
  ),
  seo: (
    <>
      <circle cx="10.5" cy="10.5" r="6.75" />
      <path d="m15.5 15.5 5 5" />
      <path d="M10.5 7.25a3 3 0 0 0-3 3c0 2.2 3 4.5 3 4.5s3-2.3 3-4.5a3 3 0 0 0-3-3Z" className="text-lime" stroke="currentColor" />
    </>
  ),
  maintenance: (
    <>
      <path d="M12 2.75 4.25 5.5v6c0 4.6 3.3 8.4 7.75 9.75 4.45-1.35 7.75-5.15 7.75-9.75v-6L12 2.75Z" />
      <path d="m8.75 12 2.25 2.25 4.25-4.5" className="text-lime" stroke="currentColor" />
    </>
  ),
  check: <path d="m4.5 12.5 4.5 4.5 10.5-11" />,
  plus: <path d="M12 5v14M5 12h14" />,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = 'size-6' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}
