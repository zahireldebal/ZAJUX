import { Inter } from 'next/font/google';

/**
 * Inter, autoalojada (next/font la descarga en el build y la sirve desde el mismo dominio).
 * En equipos Apple se usa primero la fuente del sistema (SF Pro); en el resto, Inter.
 */
export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});
