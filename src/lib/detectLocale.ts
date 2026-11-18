/**
 * Elige el idioma para la raíz "/".
 * 1) la elección guardada antes por la persona; 2) el primer idioma del navegador que
 * el sitio soporte (pt* → pt, es* → es, en* → en); 3) inglés.
 *
 * IMPORTANTE: la función debe ser autocontenida (sin referencias externas) porque se
 * serializa con toString() dentro de un <script> en la página raíz.
 */
export function pickLocale(saved: string | null, languages: readonly string[]): 'es' | 'pt' | 'en' {
  if (saved === 'es' || saved === 'pt' || saved === 'en') return saved;
  for (const raw of languages) {
    const l = (raw || '').toLowerCase();
    if (l.indexOf('pt') === 0) return 'pt';
    if (l.indexOf('es') === 0) return 'es';
    if (l.indexOf('en') === 0) return 'en';
  }
  return 'en';
}
