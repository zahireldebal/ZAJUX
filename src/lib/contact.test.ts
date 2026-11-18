import { describe, expect, it, vi } from 'vitest';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import {
  buildEmailPayload,
  buildMessage,
  createContactSchema,
  mailtoUrl,
  plainText,
  sendEmail,
  whatsappNumberFor,
  whatsappUrl,
  type ContactData,
} from './contact';

const full: ContactData = {
  name: 'Ana',
  business: 'Café Central',
  country: 'uy',
  service: 'web',
  plan: 'brand',
  timeline: '1m',
  hasWebsite: 'no',
  email: 'ana@example.com',
  message: 'Quiero una web para mi café.',
  privacy: true,
};

const minimal: ContactData = {
  ...full,
  business: '',
  plan: '',
  timeline: '',
  hasWebsite: '',
  email: '',
};

describe('ruteo de WhatsApp por idioma', () => {
  it('ES → Juani (Uruguay)', () => expect(whatsappNumberFor('es')).toBe('59892754708'));
  it('PT → Zahir (Brasil)', () => expect(whatsappNumberFor('pt')).toBe('5592984823591'));
  it('EN → Zahir (Brasil)', () => expect(whatsappNumberFor('en')).toBe('5592984823591'));

  it('arma la URL de wa.me con el texto codificado', () => {
    const url = whatsappUrl('59892754708', 'Hola, soy *Ana*\nMensaje: café & más?');
    expect(url).toBe('https://wa.me/59892754708?text=Hola%2C%20soy%20*Ana*%0AMensaje%3A%20caf%C3%A9%20%26%20m%C3%A1s%3F');
    expect(decodeURIComponent(url.split('text=')[1]!)).toBe('Hola, soy *Ana*\nMensaje: café & más?');
  });

  it('sin texto, solo el número', () => expect(whatsappUrl('+55 92 98482-3591')).toBe('https://wa.me/5592984823591'));
});

describe('mensaje en español', () => {
  const d = getDictionary('es');
  it('incluye todos los campos completados', () => {
    expect(buildMessage(full, d)).toBe(
      [
        'Hola, soy *Ana*, de *Café Central* (Uruguay).',
        'Necesito: *Sitios web y landing pages*.',
        'Plan: *Web de marca*.',
        'Plazo: *1 mes*.',
        'Ya tengo web: *No*.',
        'Mensaje: Quiero una web para mi café.',
        'Email: ana@example.com',
      ].join('\n'),
    );
  });
  it('omite los campos vacíos', () => {
    const msg = buildMessage(minimal, d);
    expect(msg).toBe('Hola, soy *Ana* (Uruguay).\nNecesito: *Sitios web y landing pages*.\nMensaje: Quiero una web para mi café.');
    expect(msg).not.toMatch(/Plan|Plazo|Ya tengo web|Email/);
  });
  it('"No estoy seguro" como servicio', () => {
    expect(buildMessage({ ...minimal, service: 'unsure' }, d)).toContain('Necesito: *No estoy seguro*.');
  });
});

describe('mensaje en portugués', () => {
  const d = getDictionary('pt');
  it('usa los textos en portugués', () => {
    const msg = buildMessage({ ...full, country: 'br', business: 'Padaria Sol' }, d);
    expect(msg.split('\n')).toEqual([
      'Olá, sou *Ana*, da *Padaria Sol* (Brasil).',
      'Preciso de: *Sites e landing pages*.',
      'Plano: *Site institucional*.',
      'Prazo: *1 mês*.',
      'Já tenho site: *Não*.',
      'Mensagem: Quiero una web para mi café.',
      'E-mail: ana@example.com',
    ]);
  });
});

describe('mensaje en inglés', () => {
  const d = getDictionary('en');
  it('usa los textos en inglés', () => {
    const msg = buildMessage({ ...minimal, country: 'other', timeline: 'asap', hasWebsite: 'yes' }, d);
    expect(msg.split('\n')).toEqual([
      "Hi, I'm *Ana* (Other).",
      'I need: *Websites & landing pages*.',
      'Timeline: *As soon as possible*.',
      'I already have a website: *Yes*.',
      'Message: Quiero una web para mi café.',
    ]);
  });
});

describe('validación', () => {
  const schema = createContactSchema(getDictionary('es').contact);
  it('acepta un formulario completo', () => expect(schema.safeParse(full).success).toBe(true));
  it('exige nombre, país, servicio, mensaje y privacidad', () => {
    const r = schema.safeParse({ ...full, name: 'A', country: '', service: '', message: 'corto', privacy: false });
    expect(r.success).toBe(false);
    const fields = r.error!.issues.map((i) => i.path[0]);
    expect(fields).toEqual(expect.arrayContaining(['name', 'country', 'service', 'message', 'privacy']));
  });
  it('mensajes de error en el idioma del sitio', () => {
    for (const [l, txt] of [
      ['es', 'Política de Privacidad'],
      ['pt', 'Política de Privacidade'],
      ['en', 'Privacy Policy'],
    ] as const) {
      const r = createContactSchema(getDictionary(l).contact).safeParse({ ...full, privacy: false });
      expect(r.error!.issues[0]!.message).toContain(txt);
    }
  });
  it('el email es opcional pero debe ser válido', () => {
    expect(schema.safeParse({ ...full, email: '' }).success).toBe(true);
    expect(schema.safeParse({ ...full, email: 'no-es-email' }).success).toBe(false);
  });
});

describe('email', () => {
  const now = new Date('2026-11-17T21:04:05.000Z');
  it.each<[Locale, string, string]>([
    ['es', 'privacidad v1.0 · 2026-11-17', 'es'],
    ['pt', 'privacidade v1.0 · 2026-11-17', 'pt-BR'],
    ['en', 'privacy v1.0 · 2026-11-17', 'en'],
  ])('%s: incluye fecha UTC e ISO, idioma y versión de la política', (locale, version, lang) => {
    const p = buildEmailPayload(full, getDictionary(locale), locale, now);
    expect(p.message).toContain('2026-11-17 21:04:05 UTC');
    expect(p.message).toContain('2026-11-17T21:04:05.000Z');
    expect(p.message).toContain(version);
    expect(p.message).toContain(`: ${lang}\n`);
    expect(p.message).not.toContain('*');
    expect(p.replyto).toBe('ana@example.com');
    expect(p.subject).toContain('Ana');
  });

  it('plainText quita el formato de WhatsApp', () => expect(plainText('Hola *Ana*, *x*')).toBe('Hola Ana, x'));

  it('sin clave de Web3Forms cae a mailto:', async () => {
    const p = buildEmailPayload(full, getDictionary('es'), 'es', now);
    const fetcher = vi.fn();
    const r = await sendEmail(p, '', fetcher as unknown as typeof fetch);
    expect(fetcher).not.toHaveBeenCalled();
    expect(r).toMatchObject({ ok: true, via: 'mailto' });
    expect(r.ok && r.mailto).toMatch(/^mailto:\?subject=/);
  });

  it('con clave, envía a Web3Forms', async () => {
    const p = buildEmailPayload(full, getDictionary('es'), 'es', now);
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    const r = await sendEmail(p, 'clave-de-prueba', fetcher as unknown as typeof fetch);
    expect(r).toEqual({ ok: true, via: 'web3forms' });
    const body = JSON.parse(fetcher.mock.calls[0]![1].body);
    expect(body.access_key).toBe('clave-de-prueba');
    expect(body.message).toContain('privacidad v1.0');
  });

  it('informa el error si Web3Forms falla', async () => {
    const p = buildEmailPayload(full, getDictionary('es'), 'es', now);
    const fetcher = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ success: false }) });
    expect(await sendEmail(p, 'k', fetcher as unknown as typeof fetch)).toEqual({ ok: false });
    const boom = vi.fn().mockRejectedValue(new Error('offline'));
    expect(await sendEmail(p, 'k', boom as unknown as typeof fetch)).toEqual({ ok: false });
  });

  it('mailtoUrl codifica asunto y cuerpo', () => {
    expect(mailtoUrl('Asunto á', 'Línea 1\nLínea 2', 'x@y.com')).toMatch(/subject=Asunto%20%C3%A1&body=L%C3%ADnea%201%0AL%C3%ADnea%202$/);
  });
});
