import {
  defineConfig
} from '@playwright/test';

export default defineConfig({
  // @ts-ignore
  globalSetup: require.resolve('./global-setup.ts'),
  testDir: './e2e-tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 30 * 1000
  },
  fullyParallel: true,
  // @ts-ignore
  forbidOnly: !!process.env.CI,
  retries: 4,
  // @ts-ignore
  workers: 4,
  reporter: [['html', {
    open: 'never'
  }]],
  use: {
    // @ts-ignore
    baseURL: process.env.HOST,
    actionTimeout: 30000,
    trace: 'on-first-retry',
    permissions: ['geolocation'],

    ignoreHTTPSErrors: true,

    viewport: {
      width: 1400,
      height: 1050
    }
  },

  projects: [
    { name: 'setup',
      testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        locale: 'de-DE',
        viewport: { width: 1400, height: 1050 }
      },
      dependencies: ['setup']
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: './e2e-tests/test-results/'
});
