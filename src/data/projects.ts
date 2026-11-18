/**
 * Portafolio. Para activarlo: agregar proyectos publicados CON PERMISO del cliente
 * y poner SHOW_PROJECTS = true. La sección y el link del menú aparecen solos.
 */
import type { Locale } from '@/i18n/config';

export const SHOW_PROJECTS = false;

export interface Project {
  id: string;
  name: string;
  url: string;
  /** Ruta dentro de /public, ej.: /projects/cafe-central.webp (16:10 recomendado). */
  image: string;
  year: number;
  country: 'UY' | 'BR' | 'other';
  tags: string[];
  description: Record<Locale, string>;
}

export const PROJECTS: Project[] = [];

export const projectsVisible = () => SHOW_PROJECTS && PROJECTS.length > 0;
