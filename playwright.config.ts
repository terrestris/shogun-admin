import {
  defineConfig
} from '@playwright/test';

const DEFAULT_HOST = 'https://localhost:8080';
const host = process.env.HOST ?? DEFAULT_HOST;

// Keep HOST available for tests/helpers that read process.env.HOST.
process.env.HOST = host;

export default defineConfig({
  // @ts-ignore
  globalSetup: require.resolve('./global-setup.ts'),
  testDir: './src/e2e-tests',
  testIgnore: process.env.TEST_IGNORE
    ? process.env.TEST_IGNORE.split(',').map(f => {
        const name = f.trim().replace(/^src\/e2e-tests\//, '');
        return `**/${name}`;
      })
    : [],
  timeout: 30 * 1000,
  expect: {
    timeout: 30 * 1000
  },
  fullyParallel: true,
  // @ts-ignore
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // @ts-ignore
  workers: 1,
  reporter: [['html', {
    open: 'never'
  }],
  ['json', {
    outputFile: './playwright-report/admin-results.json'
  }]],
  use: {
    // @ts-ignore
    headless: process.env.CI ? true : Boolean(process.env.HEADLESS),
    baseURL: host,
    actionTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    permissions: ['geolocation'],

    ignoreHTTPSErrors: true,

    viewport: {
      width: 1400,
      height: 1050
    },
    deviceScaleFactor: 1
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
  outputDir: './src/e2e-tests/test-results/'
});
