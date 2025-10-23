import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import { login } from './helpers';

export const scan = async (page: any) => {
  await page.waitForLoadState('networkidle');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  const reportHtml = createHtmlReport({
    results: accessibilityScanResults,
    options: {
      projectKey: 'test-application',
      reportFileName: 'accessibility-report.html',
    },
  });

  try {
    fs.writeFileSync('./artifacts/accessibility-report.html', reportHtml);
  } catch (error) {
    console.error('Error saving report:', error);
  }
  // Can be enabled if test should fail if violations are found. Otherwise only report is saved.
  // expect(accessibilityScanResults.violations).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await login(page, 'shogun', 'shogun', 'playwright/.auth/admin.json');
});

test.use({
  storageState: 'playwright/.auth/admin.json',
});

test('acessibility', async ({ page }) => {
  await page.goto('/admin/portal');

  await scan(page);

  console.log('Accessibility scan completed and report saved.');
  if (page) await page.close();
});
