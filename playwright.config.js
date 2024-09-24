import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: './test/e2e/global-setup.js',
  testDir: './test/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 3,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html', { outputFolder: './test/e2e/reports/' }]],
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    storageState: './LoginAuth.json',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Test against a mobile viewport. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      grep: /^(?!.*@chromium-only)/,
    },
  ],
});
