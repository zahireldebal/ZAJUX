'use client';

import type { ReactNode } from 'react';
import { useContact, type PlanId } from './ContactProvider';

/**
 * CTA que abre el formulario. Es un enlace a la sección de contacto, así que sin
 * JavaScript también funciona; con JavaScript abre el modal.
 */
export function ContactButton({
  href,
  plan,
  className = 'btn btn-primary',
  children,
  onOpen,
}: {
  href: string;
  plan?: PlanId;
  className?: string;
  children: ReactNode;
  onOpen?: () => void;
}) {
  const { openContact } = useContact();
  return (
    <a
      href={href}
      className={className}
      aria-haspopup="dialog"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onOpen?.();
        openContact(plan);
      }}
    >
      {children}
    </a>
  );
}
