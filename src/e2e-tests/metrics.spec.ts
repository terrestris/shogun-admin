import { test, expect } from '@playwright/test';
import { login, switchLanguage } from './helpers';


export const metrics = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.language-select')).toBeVisible();
  await switchLanguage(page, 'EN');

  await page.getByText('Status').click();
  await expect(page.getByText('Metrics')).toBeVisible();
  await page.getByText('Metrics').click();

  await expect(page.getByTitle(/^Metrics$/)).toBeVisible();
  await expect(page.getByTitle(/^… that measure the world$/)).toBeVisible();
  await expect(page.locator('.metrics-card-container')).toBeVisible();
  await expect(
    page.locator('#app').getByText('Current number of active')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('The current number of live')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('The amount of used memory')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('The "recent cpu usage" of')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('The uptime of the Java')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('The number of processors')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('The "recent cpu usage" of')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('Start time of the process')
  ).toBeVisible();
  await expect(
    page.locator('#app').getByText('The sum of the number of')
  ).toBeVisible();

  const statisticElement = page.locator(
    'div:nth-child(3) > div:nth-child(2) > div > div > div > div.ant-statistic-content > span.ant-statistic-content-value > span'
  );
  const initialText = await statisticElement.innerText();
  await page.waitForTimeout(5000);
  await page
    .locator(
      'div:nth-child(3) > div:nth-child(2) > .ant-card > .ant-card-actions > li > span > .ant-btn'
    )
    .click();
  await page.waitForTimeout(2000);
  const updatedText = await statisticElement.innerText();
  expect(updatedText).not.toBe(initialText);
};

test.beforeEach(async ({ page }) => {
  await login(page, 'shogun', 'shogun', 'playwright/.auth/admin.json');
});

test.use({
  storageState: 'playwright/.auth/admin.json',
});

test('metrics', async ({ page }) => {
  await page.goto('/admin/portal');

  await metrics(page);

  console.log('Metrics test completed.');
  if (page) await page.close();
});
