'use client';

import { useEffect, useState } from 'react';
import { ContactButton } from './ContactButton';
import { useContact } from './ContactProvider';
import { SECTION_IDS, sectionHref, type Locale } from '@/i18n/config';

/**
 * Botón flotante "Contanos tu proyecto": abre el formulario (no WhatsApp directo).
 * Aparece después del hero y se esconde cuando la sección de contacto o el footer están a la vista.
 */
export function FloatingCta({ locale, label }: { locale: Locale; label: string }) {
  const [show, setShow] = useState(false);
  const { isOpen } = useContact();

  useEffect(() => {
    const contact = document.getElementById(SECTION_IDS[locale].contact);
    const footer = document.querySelector('footer');
    let pastHero = false;
    let blocked = false;
    const update = () => setShow(pastHero && !blocked);

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
    };
  }, [locale]);

  const visibleNow = show && !isOpen;

  return (
    <div
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] sm:bottom-6 sm:right-6 ${
        visibleNow ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
      inert={!visibleNow}
    >
      <ContactButton href={sectionHref(locale, 'contact')} className="btn btn-primary shadow-[0_10px_40px_-10px_rgb(198_244_50/0.45)]">
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/50 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-ink" />
        </span>
        {label}
      </ContactButton>
    </div>
  );
}
