export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="btn btn-primary fixed left-4 top-3 z-[100] -translate-y-24 focus-visible:translate-y-0"
    >
      {label}
    </a>
  );
}
