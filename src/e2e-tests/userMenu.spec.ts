import { test } from '@playwright/test';

import { expect } from '@playwright/test';
import { login } from './helpers';

export const userMenu = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.header-logo', {
    state: 'visible',
    timeout: 60000,
  });
  await expect(page.locator('.username')).toBeVisible();

  const image = page.locator('.userimage').locator('img');
  await expect(image).toBeVisible();
  const width = await image.evaluate((img: any) => img.naturalWidth);
  const height = await image.evaluate((img: any) => img.naturalHeight);
  const aspectRatio = width / height;
  const expectedAspectRatio = 1 / 1;
  const tolerance = 0.01;
  await expect(aspectRatio).toBeCloseTo(expectedAspectRatio, tolerance);

  await page.locator('.user-menu').click();
  const displayedUsername = await page.locator('.user-name');
  await expect(displayedUsername).toBeVisible();
  await expect(page.getByRole('menuitem').first()).toBeVisible();

  await page.getByText('Info', { exact: true }).click();
  const display = await page
    .locator('.application-info-modal')
    .evaluate((el: any) => getComputedStyle(el).display);
  await expect(display).not.toBe('none');
  await page.getByLabel('Close', { exact: true }).first().click();

  await page.locator('.user-menu').click();
  await expect(page.locator('.user-name')).toBeVisible();
  await page.getByRole('menuitem', { name: 'setting' }).click();
  await expect(page).toHaveURL(/auth/);
  await expect(page.getByText('Manage your basic information')).toBeVisible();
  await page.getByText('Back to shogun-admin').click();
  await page.waitForTimeout(3000);

  await page.locator('.user-menu').click();
  await page.getByRole('menuitem', { name: 'logout' }).click();
  await expect(page).toHaveURL(/auth/);
};

test.beforeEach(async ({ page }) => {
  await login(page, 'shogun', 'shogun', 'playwright/.auth/admin.json');
});

test.use({
  storageState: 'playwright/.auth/admin.json',
});

test('userMenu', async ({ page }) => {
  await page.goto('/admin/portal');

  await userMenu(page);

  console.log('User menu test completed.');
  if (page) await page.close();
});
