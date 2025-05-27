import { test } from '@playwright/test';

// import { applicationsPage } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/applicationsPage';
import { expect } from '@playwright/test';

export const applicationsPage = async (page: any) => {
  await page.waitForTimeout(3000);
  const languageIndicator = page.locator('#root').getByText('DE').isVisible();
  if (languageIndicator) {
    await page.locator('.language-select').click();
    await page.locator('.ant-select-item-option-content').getByText('EN', { exact: true }).click();
  }

  await expect(page.getByRole('link', { name: 'bank Applications … that move' })).toBeVisible();
  const applicationsNumberText = await page.getByRole('link', { name: ' Applications' }).innerText();
  const applicationsNumber = applicationsNumberText.match(/\d+/)?.[0];
  await expect(page.locator('.ant-statistic-content-value').filter({
    hasText: applicationsNumber
  })).toBeVisible();
  await page.getByRole('menuitem', { name: 'bank Application' }).locator('span').first().click();

  await expect(page.locator('.ant-table-container')).toBeVisible();
  await expect(page.getByLabel(/^ID$/)).toBeVisible();
  await expect(page.getByText(/^Name$/)).toBeVisible();
  await expect(page.getByText(/^Last edited on$/)).toBeVisible();
  await expect(page.getByText(/^Link to application$/)).toBeVisible();
  await expect(page.getByLabel('sync').locator('svg')).toBeVisible();
  await expect(page.getByRole('button', { name: 'form Create Application' })).toBeVisible();

  const rowCount = await page.locator('.ant-table-row').count();
  await expect(rowCount).toBe(20);

  await page.getByRole('button', { name: 'form Create Application' }).click();
  await expect(page.getByText(/^Identifier$/)).toBeVisible();
  await expect(page.getByText(/^Created at$/)).toBeVisible();
  await expect(page.getByText(/^Status of work$/)).toBeVisible();
  await expect(page.getByText(/^Public application$/)).toBeVisible();
  await expect(page.getByText(/^Client configuration$/)).toBeVisible();
  await expect(page.getByTitle(/^Layertree$/)).toBeVisible();
  await expect(page.getByTitle(/^Layer configuration$/)).toBeVisible();
  await expect(page.getByTitle(/^Configure Tools$/)).toBeVisible();
  await expect(page.getByTitle(/^User permissions$/)).toBeVisible();
  await expect(page.getByTitle(/^Group permissions$/)).toBeVisible();
  await expect(page.getByTitle(/^Role permissions$/)).toBeVisible();

  await page.getByRole('button', { name: 'form Create Application' }).click();
  await page.getByLabel('Name').fill('Test Application Playwright');
  await page.getByRole('button', { name: 'save Save Application' }).click();
  await expect(page.getByText('Application successfully saved')).toBeVisible();
  await page.getByLabel('Close', { exact: true }).click();
  await page.getByRole('menuitem', { name: 'bank Application' }).locator('span').first().click();
  await expect(page.getByText('Test Application Playwright').first()).toBeVisible();

  const updatedRowCount = await page.locator('.ant-table-row').count();

  const targetRow = await page.locator('.ant-table-row').filter({
    hasText: 'Test Application Playwright'
  }).first();
  const rowContent = await targetRow.innerText();
  const applicationID = rowContent.match(/\d+/)?.[0];

  await page.locator('.ant-avatar').click();
  await page.getByText('Logout').click();

  await page.goto(`/client/?applicationId=${applicationID}`);
  await expect(page.getByText('Error while loading the')).toBeVisible();

  await page.goto('/admin/portal');
  await page.locator('#username').fill('shogun');
  await page.locator('#password').fill('shogun');
  await page.getByRole('button', {
    name: 'Sign in'
  }).click();

  await page.context().storageState({
    path: 'playwright/.auth/admin.json'
  });

  await page.getByRole('menuitem', { name: 'bank Application' }).locator('span').first().click();
  await page.getByRole('cell', { name: 'Test Application Playwright' }).first().click();
  await page.getByLabel('Public application').click();
  await page.getByTitle('Name').first().fill('Test Application Playwright EDITED');
  await page.getByRole('button', { name: 'undo Reset Application' }).click();
  await page.getByTitle('Name').first().fill('Test Application Playwright EDITED');
  await page.getByRole('button', { name: 'save Save Application' }).click();
  await expect(page.getByText('Application successfully saved')).toBeVisible();
  await page.getByLabel('Close', { exact: true }).click();
  await expect(page.getByText('Test Application Playwright EDITED').first()).toBeVisible();

  await page.goto(`/client/?applicationId=${applicationID}`);
  await expect(page.locator('#map')).toBeVisible();

  await page.goto('/');
  await expect(page.getByText('Test Application Playwright EDITED').first()).toBeVisible();

  await page.goto('/admin/portal');
  await page.getByRole('menuitem', { name: 'bank Application' }).locator('span').first().click();

  await page.getByRole('row', { name: 'Test Application Playwright EDITED' }).locator('div svg').nth(1).click();
  await expect(page.getByText('Delete Entity')).toBeVisible();
  await page.getByRole('dialog').getByRole('textbox').fill('Test Application Playwright EDITED');
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Delete successful')).toBeVisible();
};

test.use({
  storageState: 'playwright/.auth/admin.json'
});

test('applicationsPage', async ({
  page
}) => {

  await page.goto('/admin/portal');
  await page.waitForLoadState('networkidle');

  await applicationsPage(page);

});
