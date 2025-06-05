import { test, expect } from '@playwright/test';

// import { paging } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/paging';

export const paging = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.header-logo', { state: 'visible', timeout: 60000 });
  const languageIndicator = page.locator('#root').getByText('DE').isVisible();
  if (languageIndicator) {
    await page.locator('.language-select').click();
    await page.locator('.ant-select-item-option-content').getByText('EN', { exact: true }).click();
  }

  await expect(page.getByRole('link', { name: 'appstore Layers … that move' })).toBeVisible();
  const layersNumberText = await page.getByRole('link', { name: ' Layers' }).innerText();
  const layersNumber = layersNumberText.match(/\d+/)?.[0];
  await expect(page.locator('.ant-statistic-content-value').filter({
    hasText: layersNumber
  })).toBeVisible();
  await page.getByText('Layers', { exact: true }).first().click();

  await page.getByText('/ Page').click();
  await page.getByRole('option', { name: '10 / Page' }).locator('div').click();

  let expectedPageCount = Math.ceil(parseInt(layersNumber) / 10);

  const paginationItems = await page.locator('ul.ant-pagination li.ant-pagination-item');
  let pageCount = await paginationItems.count();

  await expect(pageCount).toBe(expectedPageCount);

  await page.getByText('Layers', { exact: true }).first().click();
  await page.getByText('/ page').first().click();
  await page.getByRole('option', { name: '20 / Page' }).locator('div').click();

  expectedPageCount = Math.ceil(parseInt(layersNumber) / 20);
  const paginationItems2 = await page.locator('ul.ant-pagination li.ant-pagination-item');
  const pageCount2 = await paginationItems2.count();

  await expect(pageCount2).toBe(expectedPageCount);

  const pageButton = page.getByText(pageCount2.toString(), { exact: true });
  await pageButton.click();

  await expect(page.getByRole('button', { name: 'right' })).toBeDisabled();

  const firstPageButton = page.getByText((1).toString(), { exact: true });
  await firstPageButton.click();

  await expect(page.getByRole('button', { name: 'left' })).toBeDisabled();
};

test.use({
  storageState: 'playwright/.auth/admin.json'
});

test('paging', async ({
  page
}) => {

  await page.goto('/admin/portal');

  await paging(page);

});
