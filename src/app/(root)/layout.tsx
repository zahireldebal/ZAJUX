import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { grotesk, mono } from '../fonts';
import { SITE_URL } from '@/data/business';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = { themeColor: '#0F1115', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
