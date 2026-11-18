import { defineConfig, devices } from '@playwright/test';

/** Pruebas sobre la exportación estática (npm run build genera /out). */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  workers: 3,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4321', trace: 'retain-on-failure' },
  webServer: {
    command: 'npx serve out -l 4321 --no-clipboard',
    url: 'http://localhost:4321/es/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 375, height: 760 } } },
  ],
});
