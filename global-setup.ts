import {
  chromium, FullConfig
} from '@playwright/test';

const DEFAULT_HOST = 'https://localhost:8080';
const DEFAULT_ID = '20';

async function globalSetup(config: FullConfig) {
  // @ts-ignore
  process.env.ID = process.env.ID ?? DEFAULT_ID;
  process.env.HOST = process.env.HOST ?? DEFAULT_HOST;
  process.env.ADMIN_LOGIN =  process.env.ADMIN_LOGIN;
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
}

export default globalSetup;
