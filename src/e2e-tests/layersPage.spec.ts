import { test, expect } from '@playwright/test';
import { deleteAllRowsWithText, login, switchLanguage } from './helpers';


export const layersPage = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.language-select')).toBeVisible();
  await switchLanguage(page, 'EN');

  await expect(
    page.getByRole('link', { name: 'appstore Layers … that move' })
  ).toBeVisible();
  const layersNumberText = await page
    .getByRole('link', { name: ' Layers' })
    .innerText();
  const layersNumber = layersNumberText.match(/\d+/)?.[0];
  await expect(
    page.locator('.ant-statistic-content-value').filter({
      hasText: layersNumber,
    })
  ).toBeVisible();
  await page.getByText('Layers', { exact: true }).first().click();

  await expect(page.locator('.ant-table-container')).toBeVisible();
  await expect(page.getByLabel(/^ID$/)).toBeVisible();
  await expect(page.getByText(/^Name$/)).toBeVisible();
  await expect(page.getByText(/^Type$/)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'form Create Layer' })
  ).toBeVisible();
  await expect(page.getByLabel('appstore-add')).toBeVisible();

  await expect(page.getByText('Total:')).toBeVisible();
  const totalLayersNumberText = await page.getByText('Total:').innerText();
  const totalLayersNumber = totalLayersNumberText.match(/\d+/)?.[0];
  await expect(totalLayersNumber).toBe(layersNumber);

  await page.getByRole('button', { name: 'form Create Layer' }).click();
  await expect(page.getByText(/^Created at$/)).toBeVisible();
  await expect(page.getByText(/^Last edited on$/)).toBeVisible();
  await expect(page.getByText(/^Public layer$/)).toBeVisible();
  await expect(page.getByTitle(/^Configuration$/)).toBeVisible();
  await expect(page.getByTitle(/^Datasource$/)).toBeVisible();
  await expect(page.getByTitle(/^User permissions$/)).toBeVisible();
  await expect(page.getByTitle(/^Group permissions$/)).toBeVisible();
  await expect(page.getByTitle(/^Role permissions$/)).toBeVisible();

  await page
    .locator('.ant-select-selection-item')
    .filter({ hasText: /^TILEWMS$/ })
    .click();
  await expect(
    page.locator('.ant-select-item-option-content').filter({ hasText: /^WFS$/ })
  ).toBeVisible();
  await expect(
    page.locator('.ant-select-item-option-content').filter({ hasText: /^WMS$/ })
  ).toBeVisible();
  await expect(
    page
      .locator('.ant-select-item-option-content')
      .filter({ hasText: /^WMSTIME$/ })
  ).toBeVisible();
  await expect(
    page.locator('.ant-select-item-option-content').filter({ hasText: /^XYZ$/ })
  ).toBeVisible();

  await page.getByLabel('Name').nth(1).fill('Test Layer Playwright');
  await page.getByRole('button', { name: 'save Save Layer' }).click();
  await expect(page.getByText('Layer successfully saved')).toBeVisible();
  await page.getByLabel('Close', { exact: true }).first().click();
  await page.getByText('Layers', { exact: true }).first().click();

  let pageNumber = 2;
  let elementFound = false;

  while (!elementFound) {
    try {
      const targetElement = page
        .getByRole('row', { name: 'Test Layer Playwright' })
        .locator('path')
        .first();
      await targetElement.waitFor({ state: 'visible', timeout: 2000 });
      await expect(targetElement).toBeVisible();
      await targetElement.click();
      elementFound = true;
    } catch (error) {
      const pageButton = page.getByText(pageNumber.toString(), { exact: true });
      await pageButton.click();
      pageNumber++;

      if (pageNumber > 10) {
        throw new Error('Element not found after checking all pages.');
      }
    }
  }

  await expect(
    page.getByText('Layer preview (Test Layer Playwright)')
  ).toBeVisible();
  await expect(page.locator('.ol-layer')).toBeVisible();
  await expect(page.getByRole('button', { name: '+' })).toBeVisible();
  await expect(page.getByRole('button', { name: '–' })).toBeVisible();
  await page.getByLabel('Close', { exact: true }).first().click();

  await page
    .getByRole('cell', { name: 'Test Layer Playwright' })
    .first()
    .click();
  await page.getByTitle('Name').first().fill('Test Layer Playwright EDITED');
  await page.getByRole('button', { name: 'undo Reset Layer' }).click();
  await expect(
    page.getByText('Test Layer Playwright EDITED')
  ).not.toBeVisible();
  await page.getByTitle('Name').first().fill('Test Layer Playwright EDITED');
  await page.getByRole('button', { name: 'save Save Layer' }).click();
  await expect(page.getByText('Layer successfully saved')).toBeVisible();
  await page.getByText('Layers', { exact: true }).first().click();
  await expect(
    page.getByText('Test Layer Playwright EDITED').first()
  ).toBeVisible();

  await page.waitForSelector('.ant-table-row', { state: 'visible' });
  await deleteAllRowsWithText(page, 'Test Layer Playwright EDITED');
  await page.waitForTimeout(1000);

  await page.getByText('ID').first().click();
  await page.waitForTimeout(1000);
  const firstRow = await page.locator('.ant-table-row').first();
  const firstRowContent = await firstRow.innerText();
  const firstID = firstRowContent.match(/\d+/)?.[0];
  const secondRow = await page.locator('.ant-table-row').nth(1);
  const secondRowContent = await secondRow.innerText();
  const secondID = secondRowContent.match(/\d+/)?.[0];
  await expect(parseInt(secondID, 10)).toBeGreaterThan(parseInt(firstID, 10));

  await page.getByRole('columnheader', { name: 'ID' }).click();
  await page.waitForTimeout(1000);
  const firstRowUpdated = await page.locator('.ant-table-row').first();
  const firstRowContentUpdated = await firstRowUpdated.innerText();
  const firstIDUpdated = firstRowContentUpdated.match(/\d+/)?.[0];
  const secondRowUpdated = await page.locator('.ant-table-row').nth(1);
  const secondRowContentUpdated = await secondRowUpdated.innerText();
  const secondIDUpdated = secondRowContentUpdated.match(/\d+/)?.[0];
  await expect(parseInt(firstIDUpdated, 10)).toBeGreaterThan(
    parseInt(secondIDUpdated, 10)
  );

  await page.getByRole('columnheader', { name: 'Type' }).locator('div').click();
  const firstRowType = await page.locator('.ant-table-row').first();
  const firstRowTypeContent = await firstRowType.innerText();
  await expect(firstRowTypeContent).toContain('WMTS');
};

test.beforeEach(async ({ page }) => {
  await login(page, 'shogun', 'shogun', 'playwright/.auth/admin.json');
});

test.use({
  storageState: 'playwright/.auth/admin.json',
});

test('layersPage', async ({ page }) => {
  await page.goto('/admin/portal');

  await layersPage(page);

  console.log('Layers page test completed.');
  if (page) await page.close();
});
