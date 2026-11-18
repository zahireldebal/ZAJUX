import { expect, test } from '@playwright/test';

for (const [lang, expected] of [
  ['es-UY', '/es/'],
  ['pt-BR', '/pt/'],
  ['en-US', '/en/'],
  ['fr-FR', '/en/'],
] as const) {
  test.describe(`navegador en ${lang}`, () => {
    test.use({ locale: lang });
    test(`/ redirige a ${expected}`, async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(new RegExp(`${expected}$`));
    });
  });
}

test.describe('elección guardada', () => {
  test.use({ locale: 'pt-BR' });
  test('el selector lleva a la misma página, guarda la elección y la raíz la respeta', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'en mobile el selector se prueba desde el menú');
    await page.addInitScript(() => sessionStorage.setItem('zajux:intro', '1'));
    await page.goto('/pt/planos/');
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
    await page.locator('header a[hreflang="es"]').click();
    await expect(page).toHaveURL(/\/es\/planes\/$/);
    expect(await page.evaluate(() => localStorage.getItem('zajux:locale'))).toBe('es');
    await page.goto('/');
    await expect(page).toHaveURL(/\/es\/$/);
  });
});

test('sin JavaScript la raíz muestra enlaces a los 3 idiomas', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  for (const name of ['Español', 'Português', 'English']) {
    await expect(page.getByRole('link', { name })).toBeVisible();
  }
  await ctx.close();
});

test('hreflang en todas las versiones', async ({ page }) => {
  for (const l of ['es', 'pt', 'en']) {
    await page.goto(`/${l}/`);
    const langs = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) => els.map((e) => e.getAttribute('hreflang')));
    expect(langs.sort()).toEqual(['en', 'es', 'pt-BR', 'x-default']);
  }
});

test('desde el contacto del inicio, el selector mantiene el contacto', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'en mobile el selector se prueba desde el menú');
  await page.addInitScript(() => sessionStorage.setItem('zajux:intro', '1'));
  await page.goto('/pt/#contato');
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
  // Al entrar por el ancla la página baja y la barra se esconde; un poco de scroll hacia arriba la muestra
  await page.waitForTimeout(800);
  await page.mouse.wheel(0, -80);
  await page.waitForTimeout(600);
  await page.locator('header a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/#contact$/);
});

test('el menú abre cada página en su idioma, con hreflang propio', async ({ page }, info) => {
  await page.addInitScript(() => sessionStorage.setItem('zajux:intro', '1'));
  await page.goto('/pt/');
  if (info.project.name === 'mobile') await page.locator('#menu-toggle').click();
  const nav = info.project.name === 'mobile' ? page.locator('#mobile-menu') : page.locator('header nav').first();
  await nav.getByRole('link', { name: 'Processo' }).click();
  await expect(page).toHaveURL(/\/pt\/processo\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const alt = await page.locator('link[rel="alternate"][hreflang="es"]').getAttribute('href');
  expect(alt).toMatch(/\/es\/proceso\/$/);
  await expect(page.locator('header a[aria-current="page"]').first()).toHaveText('Processo');
});

test('el inicio solo tiene el logo y el contacto', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.locator('main > section')).toHaveCount(2);
  await expect(page.locator('main #contacto')).toBeVisible();
});
