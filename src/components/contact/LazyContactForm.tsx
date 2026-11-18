'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useContact } from './ContactProvider';
import type { PlanId } from '@/lib/contact';

/** Precarga el código del formulario (React Hook Form + Zod) antes de necesitarlo. */
export const preloadContactForm = () => import('./ContactForm');

const ContactFormDynamic = dynamic(() => preloadContactForm().then((m) => m.ContactForm), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

function FormSkeleton() {
  return (
    <div aria-hidden="true" className="grid animate-pulse gap-5 sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="h-3 w-24 rounded bg-surface" />
          <span className="h-12 rounded-xl bg-surface/70" />
        </div>
      ))}
      <span className="h-36 rounded-xl bg-surface/70 sm:col-span-2" />
    </div>
  );
}

type Props = { eager?: boolean; initialPlan?: PlanId; idPrefix?: string };

/**
 * Formulario con carga diferida: el código se descarga cuando la sección está por
 * entrar en pantalla (o enseguida con `eager`, como en el modal).
 */
export function LazyContactForm({ eager = false, ...props }: Props) {
  const { dict, locale } = useContact();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (visible || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible]);

  return <div ref={ref}>{visible ? <ContactFormDynamic locale={locale} dict={dict} {...props} /> : <FormSkeleton />}</div>;
}
