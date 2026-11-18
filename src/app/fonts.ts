import { Space_Grotesk, Space_Mono } from 'next/font/google';

/** Autoalojadas: next/font descarga los archivos en el build y los sirve desde el mismo dominio. */
export const grotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

export const mono = Space_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-spacemono',
  display: 'swap',
});
