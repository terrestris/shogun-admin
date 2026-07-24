import {
  chromium, FullConfig
} from '@playwright/test';

const DEFAULT_HOST = 'https://shogun.intranet.terrestris.de';

async function globalSetup(config: FullConfig) {
  // @ts-ignore
  process.env.ID = '20';
  process.env.HOST = process.env.HOST ?? DEFAULT_HOST;
}

export default globalSetup;
