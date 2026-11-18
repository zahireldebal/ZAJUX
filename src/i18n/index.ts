import es, { type Dictionary } from './es';
import pt from './pt';
import en from './en';
import type { Locale } from './config';

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { es, pt, en };

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];
