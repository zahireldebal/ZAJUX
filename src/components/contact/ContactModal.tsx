'use client';

import { useEffect, useRef, useState } from 'react';
import { useContact } from './ContactProvider';
import { LazyContactForm } from './LazyContactForm';
import { DRAFT_SYNC_EVENT } from './events';
import { useScrollLock } from '@/lib/useScrollLock';
import { useFocusTrap } from '@/lib/useFocusTrap';

/** Formulario en modal: hoja inferior en mobile, ventana centrada en desktop. */
export function ContactModal({ closeLabel }: { closeLabel: string }) {
  const { isOpen, closeContact, plan, dict } = useContact();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // Montar al abrir (estado derivado durante el render)
  if (isOpen && !mounted) setMounted(true);
  const visible = isOpen && entered;

  // Animar entrada en el cuadro siguiente; al cerrar, desmontar después de la salida
  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
      return () => cancelAnimationFrame(r);
    }
    // Solo al cerrar (no en la primera carga, cuando nunca se abrió)
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const tm = setTimeout(() => {
      setEntered(false);
      setMounted(false);
      window.dispatchEvent(new Event(DRAFT_SYNC_EVENT));
    }, 450);
    return () => clearTimeout(tm);
  }, [isOpen]);

  useScrollLock(isOpen);
  useFocusTrap(panel, isOpen && mounted, closeContact);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" data-lenis-prevent>
      <div
        aria-hidden="true"
        onClick={closeContact}
        className={`absolute inset-0 bg-ink/75 backdrop-blur-sm transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className={`relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.5rem] border border-line bg-ink-2 shadow-2xl transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] sm:rounded-[1.5rem] ${
          visible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-3 sm:scale-[0.98]'
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
          <h2 id="contact-modal-title" className="text-lg font-medium sm:text-xl">
            <span className="mr-2 font-mono text-lime">&lt;/&gt;</span>
            {dict.contact.modalTitle}
          </h2>
          <button
            type="button"
            onClick={closeContact}
            aria-label={closeLabel}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-lime hover:text-lime"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-8">
          <LazyContactForm eager initialPlan={plan} idPrefix="modal" />
        </div>
      </div>
    </div>
  );
}
