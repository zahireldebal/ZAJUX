import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/es/', '/pt/', '/en/', '/es/privacidad/', '/pt/cookies/', '/en/terms/']) {
  test(`accesibilidad (axe, WCAG AA): ${path}`, async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('zajux:intro', '1'));
    await page.goto(path);
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
    // Recorrer la página para que se rendericen y revelen todas las secciones
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(summary).toEqual([]);
  });
}
