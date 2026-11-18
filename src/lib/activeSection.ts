'use client';

import { useSyncExternalStore } from 'react';
import type { SectionKey } from '@/i18n/config';

/** Sección visible actualmente (para resaltar el menú y mantenerla al cambiar de idioma). */
let current: SectionKey | null = null;
const listeners = new Set<() => void>();

export function setActiveSection(key: SectionKey | null) {
  if (key === current) return;
  current = key;
  listeners.forEach((l) => l());
}

export const getActiveSection = () => current;

export function useActiveSection() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => null,
  );
}
