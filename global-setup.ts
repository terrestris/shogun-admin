import {
  chromium, FullConfig
} from '@playwright/test';

const DEFAULT_HOST = 'https://localhost:8080';

async function globalSetup(config: FullConfig) {
  process.env.HOST = process.env.HOST ?? DEFAULT_HOST;
  process.env.ADMIN_LOGIN =  process.env.ADMIN_LOGIN;
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  process.env.HEADLESS = process.env.HEADLESS ?? 'true';
  process.env.TEST_IGNORE = process.env.TEST_IGNORE ?? '';
}

export default globalSetup;
