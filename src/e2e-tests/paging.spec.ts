import { test, expect } from '@playwright/test';
import { highlight, login, switchLanguage } from './helpers';


export const paging = async (page: any) => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.header-logo', {
    state: 'visible',
    timeout: 60000,
  });
  await expect(page.locator('.language-select')).toBeVisible();
  await switchLanguage(page, 'EN');

  await expect(
    page.getByRole('link', { name: 'appstore Layers … that move' })
  ).toBeVisible();
  await highlight(page.getByRole('link', { name: 'appstore Layers … that move' }).first());
  const layersNumberText = await page
    .getByRole('link', { name: ' Layers' })
    .innerText();
  const layersNumber = layersNumberText.match(/\d+/)?.[0];
  await expect(
    page.locator('.ant-statistic-content-value').filter({
      hasText: layersNumber,
    })
  ).toBeVisible();
  await highlight(page.locator('.ant-statistic-content-value').filter({
    hasText: layersNumber,
  }).first());
  await page.getByText('Layers', { exact: true }).first().click();

  await page.getByText('/ Page').click();
  await page.getByRole('option', { name: '10 / Page' }).locator('div').click();

  let expectedPageCount = Math.ceil(parseInt(layersNumber) / 10);

  const lastPageButton = await page.locator(
    'ul.ant-pagination li.ant-pagination-item'
  ).last();
  const lastPageNumber = parseInt(await lastPageButton.innerText());
  await highlight(lastPageButton);
  await expect(lastPageNumber).toBe(expectedPageCount);

  await page.getByText('Layers', { exact: true }).first().click();
  await page.getByText('/ page').first().click();
  await page.getByRole('option', { name: '20 / Page' }).locator('div').click();

  expectedPageCount = Math.ceil(parseInt(layersNumber) / 20);
  const paginationItems2 = await page.locator(
    'ul.ant-pagination li.ant-pagination-item'
  );
  await highlight(paginationItems2.first());
  const pageCount2 = await paginationItems2.count();

  await expect(pageCount2).toBe(expectedPageCount);

  const pageButton = page.getByText(pageCount2.toString(), { exact: true });
  await pageButton.click();

  await expect(page.getByRole('button', { name: 'right' })).toBeDisabled();

  const firstPageButton = page.getByText((1).toString(), { exact: true });
  await firstPageButton.click();

  await expect(page.getByRole('button', { name: 'left' })).toBeDisabled();
  await highlight(firstPageButton);
};

test.beforeEach(async ({ page }) => {
  await login(page, 'shogun', 'shogun', 'playwright/.auth/admin.json');
});

test.use({
  storageState: 'playwright/.auth/admin.json',
});

test('paging', async ({ page }) => {
  await page.goto('/admin/portal');

  await paging(page);

  console.log('Paging test completed.');
  if (page) await page.close();
});
