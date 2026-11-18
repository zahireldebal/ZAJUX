import { expect, test, type Page } from '@playwright/test';

/** Evita la intro y captura las ventanas que abre window.open (WhatsApp). */
async function setup(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('zajux:intro', '1');
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url: string) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

/** Navega y espera a que la página esté hidratada (las animaciones marcan "motion-ready"). */
async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
}

const opened = (page: Page) => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);

const cases = [
  { locale: 'es', number: '59892754708', greeting: 'Hola, soy *Ana*', plan: 'Consultar', review: 'Revisar mensaje', wa: 'Contactar por WhatsApp', country: 'Uruguay' },
  { locale: 'pt', number: '5592984823591', greeting: 'Olá, sou *Ana*', plan: 'Consultar', review: 'Revisar mensagem', wa: 'Chamar no WhatsApp', country: 'Uruguai' },
  { locale: 'en', number: '5592984823591', greeting: "Hi, I'm *Ana*", plan: 'Ask about it', review: 'Review message', wa: 'Contact via WhatsApp', country: 'Uruguay' },
] as const;

for (const c of cases) {
  test(`${c.locale}: Planes → modal con plan precargado → WhatsApp correcto`, async ({ page }) => {
    await setup(page);
    await gotoReady(page, `/${c.locale}/`);

    // "Consultar" del segundo plan abre el modal con ese plan
    const planButtons = page.locator('section a[aria-haspopup="dialog"]', { hasText: c.plan });
    await planButtons.nth(1).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('select[name="plan"]')).toHaveValue('booking');

    // Validación: enviar vacío muestra errores
    await dialog.getByRole('button', { name: c.review }).click();
    await expect(dialog.locator('[role="alert"]').first()).toBeVisible();

    await dialog.locator('input[name="name"]').fill('Ana');
    await dialog.locator('input[name="business"]').fill('Café Central');
    await dialog.locator('select[name="country"]').selectOption('uy');
    await dialog.locator('select[name="service"]').selectOption('web');
    await dialog.locator('select[name="timeline"]').selectOption('1m');
    await dialog.locator('label', { hasText: /^(No|Não)$/ }).click();
    await dialog.locator('textarea[name="message"]').fill('Quiero una web para mi café.');
    await dialog.locator('input[name="privacy"]').check();

    // El borrador se guarda (sin la casilla de privacidad)
    await page.waitForTimeout(500);
    const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('zajux:contact-draft') ?? '{}'));
    expect(draft.name).toBe('Ana');
    expect(draft.privacy).toBeUndefined();

    await dialog.getByRole('button', { name: c.review }).click();
    await expect(dialog).toContainText(c.greeting.replace(/\*/g, ''));

    await dialog.getByRole('button', { name: c.wa }).click();
    const urls = await opened(page);
    expect(urls).toHaveLength(1);
    const url = new URL(urls[0]!);
    expect(url.origin + url.pathname).toBe(`https://wa.me/${c.number}`);
    const text = url.searchParams.get('text')!;
    expect(text.startsWith(c.greeting)).toBe(true);
    expect(text).toContain('Café Central');
    expect(text).toContain(`(${c.country})`);

    // Al enviar se borra el borrador
    expect(await page.evaluate(() => localStorage.getItem('zajux:contact-draft'))).toBeNull();

    // Esc cierra el modal
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
}

test('email sin clave de Web3Forms cae a mailto: y borra el borrador', async ({ page }) => {
  await setup(page);
  await gotoReady(page, '/es/');
  const form = page.locator('section form').last();
  await form.scrollIntoViewIfNeeded();
  await form.locator('input[name="name"]').fill('Ana');
  await form.locator('select[name="country"]').selectOption('br');
  await form.locator('select[name="service"]').selectOption('unsure');
  await form.locator('input[name="email"]').fill('ana@example.com');
  await form.locator('textarea[name="message"]').fill('Necesito ayuda con mi negocio.');
  await form.locator('input[name="privacy"]').check();
  await form.getByRole('button', { name: 'Revisar mensaje' }).click();

  await page.getByRole('button', { name: 'Enviar por email' }).click();
  await expect(page.getByText('Se va a abrir tu programa de email')).toBeVisible();
  // El contenido del email (fecha UTC/ISO, idioma y versión de la política) se prueba en src/lib/contact.test.ts
  expect(await page.evaluate(() => localStorage.getItem('zajux:contact-draft'))).toBeNull();
});

test('email sin dirección pide el email', async ({ page }) => {
  await setup(page);
  await gotoReady(page, '/es/');
  const form = page.locator('section form').last();
  await form.locator('input[name="name"]').fill('Ana');
  await form.locator('select[name="country"]').selectOption('uy');
  await form.locator('select[name="service"]').selectOption('seo');
  await form.locator('textarea[name="message"]').fill('Quiero aparecer en Google Maps.');
  await form.locator('input[name="privacy"]').check();
  await form.getByRole('button', { name: 'Revisar mensaje' }).click();
  await page.getByRole('button', { name: 'Enviar por email' }).click();
  await expect(page.getByText('Para responderte por email necesitamos tu dirección.')).toBeVisible();
  await expect(page.locator('section input[name="email"]').last()).toBeFocused();
});

test('tarjetas directas: WhatsApp de Juani y de Zahir sin mostrar números', async ({ page }) => {
  await setup(page);
  await gotoReady(page, '/es/');
  const juani = page.getByRole('link', { name: 'WhatsApp de Juani' });
  const zahir = page.getByRole('link', { name: 'WhatsApp de Zahir' });
  await expect(juani).toHaveAttribute('href', /^https:\/\/wa\.me\/59892754708\?text=/);
  await expect(zahir).toHaveAttribute('href', /^https:\/\/wa\.me\/5592984823591\?text=/);
  const text = await page.locator('main').innerText();
  expect(text).not.toContain('92754708');
  expect(text).not.toContain('984823591');
});
