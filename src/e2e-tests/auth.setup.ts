import {
  test as setup
} from '@playwright/test';

import { login } from './helpers';

process.on('unhandledRejection', () => {
  process.exit(1);
});

process.on('uncaughtException', () => {
  process.exit(1);
});

setup('authenticate as admin', async ({ page }) => {
  await login(page, process.env.ADMIN_LOGIN, process.env.ADMIN_PASSWORD, 'playwright/.auth/admin.json');
});

// More Users can be added here
