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
  test('el selector mantiene la sección, guarda la elección y la raíz la respeta', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile', 'en mobile el selector se prueba desde el menú');
    await page.addInitScript(() => sessionStorage.setItem('zajux:intro', '1'));
    await page.goto('/pt/#planos');
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
    await page.waitForTimeout(800);
    await page.mouse.wheel(0, -80);
    await page.waitForTimeout(600);
    await page.locator('header a[hreflang="es"]').click();
    await expect(page).toHaveURL(/\/es\/#planes$/);
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
