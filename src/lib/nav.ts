import type { PageKey } from '@/i18n/config';
import { projectsVisible } from '@/data/projects';

/** Páginas que aparecen en el menú (Proyectos solo si el portafolio está activo). */
export function navPages(): PageKey[] {
  const base: PageKey[] = ['services', 'process', 'plans', 'about', 'faq'];
  if (projectsVisible()) base.splice(4, 0, 'projects');
  return base;
}
