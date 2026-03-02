import {
  chromium, FullConfig
} from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // @ts-ignore
  process.env.ID = '20';
  // @ts-ignore
  process.env.HOST = 'https://localhost';
}

export default globalSetup;
