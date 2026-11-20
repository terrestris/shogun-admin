import { test, expect } from '@playwright/test';
import { highlight, login, switchLanguage } from './helpers';


export const metrics = async (page: any) => {
  await expect(page.locator('.language-select')).toBeVisible();
  await switchLanguage(page, 'EN');

  await page.getByText('Status').click();
  await expect(page.getByText('Metrics')).toBeVisible();
  await page.getByText('Metrics').click();

  await expect(page.getByTitle(/^Metrics$/)).toBeVisible();
  await highlight(page.getByTitle(/^Metrics$/).first());
  await expect(page.getByTitle(/^… that measure the world$/)).toBeVisible();
  await highlight(page.getByTitle(/^… that measure the world$/).first());
  await expect(page.locator('.metrics-card-container')).toBeVisible();
  await highlight(page.locator('.metrics-card-container').first());
  await expect(
    page.locator('#app').getByText('Current number of active')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('Current number of active').first());
  await expect(
    page.locator('#app').getByText('The current number of live')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('The current number of live').first());
  await expect(
    page.locator('#app').getByText('The amount of used memory')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('The amount of used memory').first());
  await expect(
    page.locator('#app').getByText('The "recent cpu usage" of')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('The "recent cpu usage" of').first());
  await expect(
    page.locator('#app').getByText('The uptime of the Java')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('The uptime of the Java').first());
  await expect(
    page.locator('#app').getByText('The number of processors')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('The number of processors').first());
  await expect(
    page.locator('#app').getByText('The "recent cpu usage" of')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('The "recent cpu usage" of').first());
  await expect(
    page.locator('#app').getByText('Start time of the process')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('Start time of the process').first());
  await expect(
    page.locator('#app').getByText('The sum of the number of')
  ).toBeVisible();
  await highlight(page.locator('#app').getByText('The sum of the number').first());

  const uptimeCard = page
    .locator('.ant-card')
    .filter({ hasText: 'The uptime of the Java virtual machine' })
    .first();
  const uptimeValue = uptimeCard
    .locator('.ant-statistic-content-value')
    .first();

  await expect(uptimeCard).toBeVisible();
  await expect(uptimeValue).toBeVisible();
  await highlight(uptimeValue);

  const initialUptime = (await uptimeValue.innerText()).trim();
  await uptimeCard.getByRole('button', { name: 'reload' }).click();

  const toSeconds = (uptime: string) => {
    const parts = uptime.split(':').map((part) => Number(part));
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
      return -1;
    }

    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  const initialSeconds = toSeconds(initialUptime);

  await expect
    .poll(async () => toSeconds((await uptimeValue.innerText()).trim()), {
      timeout: 10000,
    })
    .toBeGreaterThanOrEqual(initialSeconds);
};

test.beforeEach(async ({ page }) => {
  await login(page, process.env.ADMIN_LOGIN, process.env.ADMIN_PASSWORD, './src/e2e-tests/.auth/admin.json');
});

test.use({
  storageState: './src/e2e-tests/.auth/admin.json',
});

test('metrics', async ({ page }) => {
  await page.goto('/admin/portal');

  await metrics(page);

  console.log('Metrics test completed.');
  if (page) await page.close();
});
