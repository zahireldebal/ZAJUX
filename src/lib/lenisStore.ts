'use client';

import type Lenis from 'lenis';

/** Referencia global a la instancia de Lenis (si está activa). */
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;
