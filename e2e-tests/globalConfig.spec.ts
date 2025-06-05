import { test, expect } from '@playwright/test';

// import { globalConfig } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/globalConfig';

export const globalConfig = async (page: any) => {
    await page.waitForLoadState('networkidle');
    const languageIndicator = page.locator('#root').getByText('DE').isVisible();
    if (languageIndicator) {
        await page.locator('.language-select').click();
        await page.locator('.ant-select-item-option-content').getByText('EN', { exact: true }).click();
    }

    await page.getByText('Configuration').click();
    await expect(page.getByText('Global')).toBeVisible();
    await page.getByText('Global').click();

    await expect(page.getByTitle(/^Configuration$/)).toBeVisible();
    await expect(page.getByTitle(/^… that guide the world$/)).toBeVisible();
    await page.getByRole('button', { name: 'clear Clear cache' }).click();
    await expect(page.getByText('Successfully cleared the cache').first()).toBeVisible();

    const cacheData = await page.evaluate(() => localStorage.getItem('cacheKey'));
    expect(cacheData).toBeNull();
};

test.use({
    storageState: 'playwright/.auth/admin.json'
});

test('globalConfig', async ({
    page
}) => {

    await page.goto('/admin/portal');

    await globalConfig(page);

});
