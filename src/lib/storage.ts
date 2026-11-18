/**
 * Acceso seguro a localStorage / sessionStorage. En navegación privada, con datos
 * bloqueados o durante el render en el servidor, devuelve null sin romper nada.
 */
type Kind = 'local' | 'session';

function store(kind: Kind): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage(key: string, kind: Kind = 'local'): string | null {
  try {
    return store(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, kind: Kind = 'local'): void {
  try {
    store(kind)?.setItem(key, value);
  } catch {
    /* sin almacenamiento disponible: no pasa nada */
  }
}

export function removeStorage(key: string, kind: Kind = 'local'): void {
  try {
    store(kind)?.removeItem(key);
  } catch {
    /* idem */
  }
}

export function readJSON<T>(key: string, kind: Kind = 'local'): T | null {
  const raw = readStorage(key, kind);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
