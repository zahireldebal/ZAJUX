import { describe, expect, it } from 'vitest';
import { pickLocale } from './detectLocale';

describe('pickLocale', () => {
  it('respeta la elección guardada', () => {
    expect(pickLocale('es', ['pt-BR'])).toBe('es');
    expect(pickLocale('pt', ['en-US'])).toBe('pt');
  });
  it('ignora valores guardados inválidos', () => {
    expect(pickLocale('fr', ['es-UY'])).toBe('es');
  });
  it('pt* → pt', () => {
    expect(pickLocale(null, ['pt-BR', 'en'])).toBe('pt');
    expect(pickLocale(null, ['PT-pt'])).toBe('pt');
  });
  it('es* → es', () => {
    expect(pickLocale(null, ['es-419'])).toBe('es');
    expect(pickLocale(null, ['de-DE', 'es-UY'])).toBe('es');
  });
  it('usa el primer idioma soportado', () => {
    expect(pickLocale(null, ['en-US', 'es'])).toBe('en');
  });
  it('cualquier otro → en', () => {
    expect(pickLocale(null, ['fr-FR', 'de'])).toBe('en');
    expect(pickLocale(null, [])).toBe('en');
  });
});
