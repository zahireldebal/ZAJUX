import es from './es';
import pt from './pt';
import en from './en';
import type { Locale } from '../config';
import type { LegalContent } from './types';

const LEGAL: Record<Locale, LegalContent> = { es, pt, en };
export const getLegal = (locale: Locale) => LEGAL[locale];
export type { LegalContent, LegalDoc, LegalSection, LegalBlock } from './types';
