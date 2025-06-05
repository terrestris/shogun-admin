import { test, expect } from '@playwright/test';

// import { landingPage } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/landingPage';

export const landingPage = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.header-logo', { state: 'visible', timeout: 60000 }); 
  const logo = await page.locator('.header-logo');
  await expect(logo).toBeVisible();
  await expect(page.locator('.language-select')).toBeVisible();
  const languageIndicator = page.locator('#root').getByText('DE').isVisible();
  if (languageIndicator) {
    await page.locator('.language-select').click();
    await page.locator('.ant-select-item-option-content').getByText('EN', { exact: true }).click();
  }

  await page.waitForSelector('.user-menu', { state: 'visible', timeout: 60000 }); 
  await expect(page.locator('.user-menu')).toBeVisible();

  await expect(page.locator('.portal')).toBeVisible();

  const menu = await page.locator('.menu');
  await expect(menu).toBeVisible();
  await page.locator('.menu-toggle-button').click();
  await expect(page.locator('.ant-menu-submenu-title').first()).toHaveAttribute('aria-expanded', 'false');
  await page.locator('[aria-label="menu-unfold"]').click();
  await expect(menu).toContainText('Application');
  await expect(menu).toContainText('Layers');
  await expect(menu).toContainText('User');
  await expect(menu).toContainText('Groups');
  await expect(menu).toContainText('Images');
  await expect(menu).toContainText('Status');
  await expect(menu).toContainText('Configuration');

  await expect(page.locator('.ant-menu-submenu-title').first()).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.content')).toBeVisible();


  await expect(page.locator('div').filter({ hasText: /^Applications$/ })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Layers$/ })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^User$/ })).toBeVisible();
};

test.use({
  storageState: 'playwright/.auth/admin.json'
});

test('landingPage', async ({
  page
}) => {

  await page.goto('/admin/portal');
  await page.waitForLoadState('networkidle');

  await landingPage(page);

});
