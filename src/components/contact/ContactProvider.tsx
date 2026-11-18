'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type PlanId = 'brand' | 'booking' | 'custom' | 'maintenance';

interface ContactCtx {
  /** Abre el formulario de contacto (modal), opcionalmente con un plan preseleccionado. */
  openContact: (plan?: PlanId) => void;
  closeContact: () => void;
  isOpen: boolean;
  plan: PlanId | undefined;
}

const Ctx = createContext<ContactCtx | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanId | undefined>(undefined);

  const openContact = useCallback((p?: PlanId) => {
    setPlan(p);
    setOpen(true);
  }, []);
  const closeContact = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openContact, closeContact, isOpen, plan }), [openContact, closeContact, isOpen, plan]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContact() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useContact debe usarse dentro de ContactProvider');
  return ctx;
}
