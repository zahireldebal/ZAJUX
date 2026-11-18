'use client';

import { useEffect } from 'react';
import { getLenis } from './lenisStore';

let locks = 0;

/** Bloquea el scroll de la página mientras `active` sea true (menú, modal). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    locks += 1;
    if (locks === 1) {
      const sbw = window.innerWidth - html.clientWidth;
      html.style.overflow = 'hidden';
      if (sbw > 0) html.style.paddingRight = `${sbw}px`;
      getLenis()?.stop();
    }
    return () => {
      locks -= 1;
      if (locks === 0) {
        html.style.overflow = '';
        html.style.paddingRight = '';
        getLenis()?.start();
      }
    };
  }, [active]);
}
