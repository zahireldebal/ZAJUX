import type { LegalKey } from '../config';

/** Un bloque es un párrafo (string) o una lista (string[]). Admite {email}, {version}, {date}. */
export type LegalBlock = string | string[];

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  description: string;
  intro: string;
  sections: LegalSection[];
}

export type LegalContent = Record<LegalKey, LegalDoc>;
