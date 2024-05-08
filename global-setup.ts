import {
  chromium, FullConfig
} from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // @ts-ignore
  process.env.ID = '20';
  // @ts-ignore
  process.env.HOST = 'https://shogun2022.intranet.terrestris.de';
  // @ts-ignore
  process.env.ADMIN_LOGIN = 'shogun';
  // @ts-ignore
  process.env.ADMIN_PASSWORD = 'shogun';
}

export default globalSetup;
