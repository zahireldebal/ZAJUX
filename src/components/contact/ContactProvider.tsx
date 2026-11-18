'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ContactDict } from '@/lib/contact';
import type { Locale } from '@/i18n/config';

export type PlanId = 'brand' | 'booking' | 'custom' | 'maintenance';

interface ContactCtx {
  /** Abre el formulario de contacto (modal), opcionalmente con un plan preseleccionado. */
  openContact: (plan?: PlanId) => void;
  closeContact: () => void;
  isOpen: boolean;
  plan: PlanId | undefined;
  /** Textos del formulario (se envían una sola vez para toda la página). */
  dict: ContactDict;
  locale: Locale;
}

const Ctx = createContext<ContactCtx | null>(null);

export function ContactProvider({ children, dict, locale }: { children: ReactNode; dict: ContactDict; locale: Locale }) {
  const [isOpen, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanId | undefined>(undefined);

  const openContact = useCallback((p?: PlanId) => {
    setPlan(p);
    setOpen(true);
  }, []);
  const closeContact = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openContact, closeContact, isOpen, plan, dict, locale }),
    [openContact, closeContact, isOpen, plan, dict, locale],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContact() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useContact debe usarse dentro de ContactProvider');
  return ctx;
}
