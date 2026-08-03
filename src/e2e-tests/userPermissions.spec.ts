import { test, expect } from '@playwright/test';
import { deleteAllRowsWithText, highlight, login, switchLanguage } from './helpers';


export const userPermissions = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.language-select')).toBeVisible();
  await switchLanguage(page, 'EN');

  await expect(
    page.getByRole('link', { name: 'bank Applications … that move' })
  ).toBeVisible();
  await highlight(
    page.getByRole('link', { name: 'bank Applications … that move' }).first()
  );
  await page
    .getByRole('menuitem', { name: 'bank Application' })
    .locator('span')
    .first()
    .click();
   await page.getByRole('button', { name: 'form Create Application' }).click();
  await page
    .getByLabel('Name')
    .nth(1)
    .fill('Test Application userPermission Playwright');
  await page.getByRole('button', { name: 'save Save Application' }).click();
  await expect(page.getByText('Application successfully saved')).toBeVisible();
  await highlight(page.getByText('Application successfully saved').first());

  await page.locator('#application').getByRole('button', { name: 'plus' }).last().click();
  await page
    .locator(
      '.ant-form-item-control-input-content > .ant-select > .ant-select-selector'
    )
    .first()
    .click();
  await page.locator('#referenceIds').fill('admin');
  await page.locator('#referenceIds').press('Enter');
  await page.locator('.ant-modal-title').first().click();
  await page.locator('#permission').click();
  await page.getByText('Read', { exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();

  await page.locator('#application').getByTitle('Read').click();
  await page.getByText('Update', { exact: true }).click();
  await page.locator('#application').getByTitle('Update').click();
  await page.getByText('Update & Delete').click();
  await page.locator('#application').getByTitle('Update & Delete').click();
  await page.getByText('Owner').last().click();
  const deleteIcon = page
    .locator('#application')
    .locator('.ant-table')
    .last()
    .locator('svg')
    .last();
  await expect(deleteIcon).toBeVisible();
  await deleteIcon.click();

  await page.waitForSelector('.ant-table-row', { state: 'visible' });
  await deleteAllRowsWithText(
    page,
    'Test Application userPermission Playwright'
  );
};

test.beforeEach(async ({ page }) => {
  await login(page, process.env.ADMIN_LOGIN, process.env.ADMIN_PASSWORD, './src/e2e-tests/.auth/admin.json');
});

test.use({
  storageState: './src/e2e-tests/.auth/admin.json',
});

test('userPermissions', async ({ page }) => {
  await page.goto('/admin/portal');

  await userPermissions(page);

  console.log('User permissions test completed.');
  if (page) await page.close();
});
