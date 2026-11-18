import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('zajux:intro', '1'));
  await page.goto('/es/#demos');
  await page.waitForFunction(() => document.documentElement.classList.contains('motion-ready'));
});

test('reserva de turno: servicio → día → hora → confirmación', async ({ page }) => {
  const demo = page.locator('li', { has: page.getByRole('heading', { name: 'Reserva de turno' }) });
  await demo.getByRole('button', { name: /Corte y barba/ }).click();
  await demo.locator('ul.grid-cols-3 button').first().click();
  const free = demo.locator('ul.grid-cols-4 button:not([disabled])').first();
  const time = (await free.textContent())!.trim();
  await free.click();
  await expect(demo.getByText('¡Reserva confirmada!')).toBeVisible();
  await expect(demo.getByText(new RegExp(`Corte y barba · .* a las ${time}`))).toBeVisible();
  await demo.getByRole('button', { name: 'Hacer otra reserva' }).click();
  await expect(demo.getByText('Elegí un servicio')).toBeVisible();
});

test('formulario a WhatsApp: el mensaje se arma mientras se escribe', async ({ page }) => {
  const demo = page.locator('li', { has: page.getByRole('heading', { name: 'Formulario a WhatsApp' }) });
  await demo.getByLabel('Tu nombre').fill('Ana');
  await demo.getByLabel('Vehículo').fill('Fiat Uno');
  await demo.locator('label', { hasText: 'Frenos' }).click();
  await expect(demo.getByText('Hola, soy Ana. Tengo un Fiat Uno y necesito: Frenos.')).toBeVisible();
});

test('antes/después: se controla con el teclado', async ({ page }) => {
  const slider = page.getByRole('slider', { name: 'Deslizá para comparar el antes y el después' });
  await slider.focus();
  await expect(slider).toHaveAttribute('aria-valuenow', '50');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', '54');
  await page.keyboard.press('Home');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
});

test('cada demo está etiquetada como "Demo" y tiene su CTA', async ({ page }) => {
  const section = page.locator('#demos');
  await expect(section.getByText('Demo', { exact: true })).toHaveCount(3);
  await expect(section.getByRole('link', { name: 'Quiero algo así' })).toHaveCount(3);
});
