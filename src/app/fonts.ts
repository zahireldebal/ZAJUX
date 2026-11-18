import { Space_Grotesk, Space_Mono } from 'next/font/google';

/**
 * Autoalojadas: next/font descarga los archivos en el build y los sirve desde el mismo dominio.
 * Space Grotesk es variable (un solo archivo para todos los pesos).
 */
export const grotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-grotesk',
  display: 'swap',
});

export const mono = Space_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-spacemono',
  display: 'swap',
  // Solo etiquetas chicas: no se precarga para no competir con lo esencial en conexiones lentas
  preload: false,
});
