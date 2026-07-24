import { test } from '@playwright/test';

import { expect } from '@playwright/test';
import { deleteAllRowsWithText, highlight, login, switchLanguage } from './helpers';

export const applicationsPage = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.language-select')).toBeVisible();
  await switchLanguage(page, 'EN');

  await expect(
    page.getByRole('link', { name: 'bank Applications … that move' })
  ).toBeVisible();
  await highlight(
    page.getByRole('link', { name: 'bank Applications … that move' }).first()
  );
  const applicationsNumberText = await page
    .getByRole('link', { name: ' Applications' })
    .innerText();
  const applicationsNumber = applicationsNumberText.match(/\d+/)?.[0];
  await expect(
    page.locator('.ant-statistic-content-value').filter({
      hasText: applicationsNumber,
    }).first()
  ).toBeVisible();
  await highlight(
    page.locator('.ant-statistic-content-value').filter({
      hasText: applicationsNumber,
    }).first()
  );
  await page
    .getByRole('menuitem', { name: 'bank Application' })
    .locator('span')
    .first()
    .click();

  await expect(page.locator('.ant-table-container')).toBeVisible();
  await highlight(page.locator('.ant-table-container').first());
  await expect(page.getByLabel(/^ID$/)).toBeVisible();
  await highlight(page.getByLabel(/^ID$/).first());
  await expect(page.getByText(/^Name$/)).toBeVisible();
  await highlight(page.getByText(/^Name$/).first());
  await expect(page.getByText(/^Last edited on$/)).toBeVisible();
  await highlight(page.getByText(/^Last edited on$/).first());
  await expect(page.getByText(/^Link to application$/)).toBeVisible();
  await highlight(page.getByText(/^Link to application$/).first());
  await expect(page.getByLabel('sync').locator('svg')).toBeVisible();
  await highlight(page.getByLabel('sync').locator('svg').first());
  await expect(
    page.getByRole('button', { name: 'form Create Application' })
  ).toBeVisible();
  await highlight(
    page.getByRole('button', { name: 'form Create Application' }).first()
  );

  const rowCount = await page.locator('.ant-table-row').count();
  if (applicationsNumber < 20) {
    expect(rowCount).toBe(Number(applicationsNumber));
  } else {
    expect(rowCount).toBe(20);
  }

  await page.getByRole('button', { name: 'form Create Application' }).click();
  await expect(page.getByText(/^Identifier$/)).toBeVisible();
  await highlight(page.getByText(/^Identifier$/).first());
  await expect(page.getByText(/^Created at$/)).toBeVisible();
  await highlight(page.getByText(/^Created at$/).first());
  await expect(page.getByText(/^Status of work$/)).toBeVisible();
  await highlight(page.getByText(/^Status of work$/).first());
  await expect(page.getByText(/^Public application$/)).toBeVisible();
  await highlight(page.getByText(/^Public application$/).first());
  await expect(page.getByText(/^Client configuration$/)).toBeVisible();
  await highlight(page.getByText(/^Client configuration$/).first());
  await expect(page.getByTitle(/^Layertree$/)).toBeVisible();
  await highlight(page.getByTitle(/^Layertree$/).first());
  await expect(page.getByTitle(/^Layer configuration$/)).toBeVisible();
  await highlight(page.getByTitle(/^Layer configuration$/).first());
  await expect(page.getByTitle(/^Configure Tools$/)).toBeVisible();
  await highlight(page.getByTitle(/^Configure Tools$/).first());
  await expect(page.getByTitle(/^User permissions$/)).toBeVisible();
  await highlight(page.getByTitle(/^User permissions$/).first());
  await expect(page.getByTitle(/^Group permissions$/)).toBeVisible();
  await highlight(page.getByTitle(/^Group permissions$/).first());
  await expect(page.getByTitle(/^Role permissions$/)).toBeVisible();
  await highlight(page.getByTitle(/^Role permissions$/).first());

  await page.getByRole('button', { name: 'form Create Application' }).click();
  await page.getByLabel('Name').nth(1).fill('Test Application Playwright');
  await page.getByRole('button', { name: 'save Save Application' }).click();
  await expect(page.getByText('Application successfully saved')).toBeVisible();
  await highlight(page.getByText('Application successfully saved').first());
  await page.getByLabel('Close', { exact: true }).click();
  await page
    .getByRole('menuitem', { name: 'bank Application' })
    .locator('span')
    .first()
    .click();
  await expect(
    page.getByText('Test Application Playwright').first()
  ).toBeVisible();

  const targetRow = await page
    .locator('.ant-table-row')
    .filter({
      hasText: 'Test Application Playwright',
    })
    .first();
  await highlight(targetRow);
  const rowContent = await targetRow.innerText();
  const applicationID = rowContent.match(/\d+/)?.[0];

  await page.locator('.ant-avatar').click();
  await page.getByText('Logout').click();

  await page.goto(`/client/?applicationId=${applicationID}`);
  await expect(page.getByText('Error while loading the')).toBeVisible();

  await page.goto('/admin/portal');
  await page.locator('#username').fill('shogun');
  await page.locator('#password').fill('shogun');
  await page
    .getByRole('button', {
      name: 'Sign in',
    })
    .click();

  await page.context().storageState({
    path: 'playwright/.auth/admin.json',
  });

  await page
    .getByRole('menuitem', { name: 'bank Application' })
    .locator('span')
    .first()
    .click();
  await page
    .getByRole('cell', { name: 'Test Application Playwright' })
    .first()
    .click();
  await page.getByLabel('Public application').click();
  await page
    .getByTitle('Name')
    .first()
    .fill('Test Application Playwright EDITED');
  await page.getByRole('button', { name: 'undo Reset Application' }).click();
  await page
    .getByTitle('Name')
    .first()
    .fill('Test Application Playwright EDITED');
  await page.getByRole('button', { name: 'save Save Application' }).click();
  await expect(page.getByText('Application successfully saved')).toBeVisible();
  await highlight(page.getByText('Application successfully saved').first());
  await page.getByLabel('Close', { exact: true }).click();
  await expect(
    page.getByText('Test Application Playwright EDITED').first()
  ).toBeVisible();

  await page.goto(`/client/?applicationId=${applicationID}`);
  await expect(page.locator('#map')).toBeVisible();
  await highlight(page.locator('#map'));

  await page.goto('/admin/portal');
  await page
    .getByRole('menuitem', { name: 'bank Application' })
    .locator('span')
    .first()
    .click();

  await page.waitForSelector('.ant-table-row', { state: 'visible' });
  await deleteAllRowsWithText(page, 'Test Application Playwright EDITED');
};

test.beforeEach(async ({ page }) => {
  await login(page, 'shogun', 'shogun', 'playwright/.auth/admin.json');
});

test.use({
  storageState: 'playwright/.auth/admin.json',
});

test('applicationsPage', async ({ page }) => {
  await page.goto('/admin/portal');
  await page.waitForLoadState('networkidle');

  await applicationsPage(page);

  console.log('Applications page test completed.');
  if (page) await page.close();
});
