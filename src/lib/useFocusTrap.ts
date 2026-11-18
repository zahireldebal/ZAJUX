'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Mantiene el foco dentro de `ref` mientras esté activo, cierra con Escape y
 * devuelve el foco al elemento que lo tenía antes.
 * @param extra selector de elementos de afuera que también forman parte del ciclo (ej. el botón que cierra)
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape: () => void, extra?: string) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previous = document.activeElement as HTMLElement | null;

    const items = () => {
      const inner = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      const outer = extra ? Array.from(document.querySelectorAll<HTMLElement>(extra)) : [];
      return [...outer, ...inner].filter((el) => el.offsetParent !== null || el === document.activeElement);
    };

    const first = items().find((el) => root.contains(el)) ?? root;
    requestAnimationFrame(() => first.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = items();
      if (!list.length) return;
      const idx = list.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (idx <= 0 ? list.length - 1 : idx - 1) : idx === list.length - 1 ? 0 : idx + 1;
      e.preventDefault();
      list[next]?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [ref, active, onEscape, extra]);
}
