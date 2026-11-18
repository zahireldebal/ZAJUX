'use client';

import { useEffect, useState } from 'react';
import { ContactButton } from './ContactButton';
import { useContact } from './ContactProvider';
import { CONTACT_ID, contactHref, type Locale } from '@/i18n/config';

/**
 * Botón flotante "Contanos tu proyecto": abre el formulario (no WhatsApp directo).
 * Aparece al bajar una pantalla y se esconde cuando la sección de contacto o el footer están a la vista.
 */
export function FloatingCta({ locale, label }: { locale: Locale; label: string }) {
  const [show, setShow] = useState(false);
  const { isOpen } = useContact();

  useEffect(() => {
    const contact = document.getElementById(CONTACT_ID[locale]);
    const footer = document.querySelector('footer');
    let pastHero = false;
    let blocked = false;
    // Aparece recién cuando la persona empezó a recorrer la página (no por un salto a un ancla)
    let interacted = false;
    const update = () => setShow(interacted && pastHero && !blocked);
    const onInteract = () => {
      interacted = true;
      update();
    };
    const inputs = ['wheel', 'touchmove', 'keydown'] as const;
    inputs.forEach((ev) => window.addEventListener(ev, onInteract, { passive: true, once: true }));

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.85;
      update();
    };
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target, e.isIntersecting));
      blocked = Array.from(visible.values()).some(Boolean);
      update();
    });
    if (contact) io.observe(contact);
    if (footer) io.observe(footer);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      inputs.forEach((ev) => window.removeEventListener(ev, onInteract));
    };
  }, [locale]);

  const visibleNow = show && !isOpen;

  return (
    <div
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 transition-[transform,opacity,visibility] duration-500 ease-[var(--ease-out-expo)] sm:bottom-6 sm:right-6 ${
        visibleNow ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-6 opacity-0'
      }`}
      inert={!visibleNow}
    >
      <ContactButton href={contactHref(locale)} className="btn btn-primary shadow-[0_10px_40px_-10px_rgb(198_244_50/0.45)]">
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/50" />
          <span className="relative inline-flex size-2 rounded-full bg-ink" />
        </span>
        {label}
      </ContactButton>
    </div>
  );
}
