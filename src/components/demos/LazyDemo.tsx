'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/i18n';

const Skeleton = () => (
  <div aria-hidden="true" className="flex h-full animate-pulse flex-col gap-3">
    <span className="h-4 w-1/3 rounded bg-surface" />
    <span className="h-11 rounded-xl bg-surface/70" />
    <span className="h-11 rounded-xl bg-surface/70" />
    <span className="h-11 rounded-xl bg-surface/70" />
  </div>
);

const Booking = dynamic(() => import('./BookingDemo').then((m) => m.BookingDemo), { ssr: false, loading: Skeleton });
const WhatsApp = dynamic(() => import('./WhatsAppDemo').then((m) => m.WhatsAppDemo), { ssr: false, loading: Skeleton });
const BeforeAfter = dynamic(() => import('./BeforeAfterDemo').then((m) => m.BeforeAfterDemo), { ssr: false, loading: Skeleton });

type D = Dictionary['demos'];
type Props =
  | { kind: 'booking'; t: D['booking']; lang: string }
  | { kind: 'whatsapp'; t: D['whatsapp'] }
  | { kind: 'beforeAfter'; t: D['beforeAfter'] };

/** Demo interactiva que descarga su código recién cuando está por entrar en pantalla. */
export function LazyDemo(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  let content = <Skeleton />;
  if (show) {
    if (props.kind === 'booking') content = <Booking t={props.t} lang={props.lang} />;
    else if (props.kind === 'whatsapp') content = <WhatsApp t={props.t} />;
    else content = <BeforeAfter t={props.t} />;
  }
  return (
    <div ref={ref} className="flex h-full flex-1 flex-col">
      {content}
    </div>
  );
}
