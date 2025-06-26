import { test, expect } from "@playwright/test";
import { login, switchLanguage } from "./helpers";

// import { globalConfig } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/globalConfig';

export const globalConfig = async (page: any) => {
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".language-select")).toBeVisible();
  await switchLanguage(page, "EN");

  await page.getByText("Configuration").click();
  await expect(page.getByText("Global")).toBeVisible();
  await page.getByText("Global").click();

  await expect(page.getByTitle(/^Configuration$/)).toBeVisible();
  await expect(page.getByTitle(/^… that guide the world$/)).toBeVisible();
  await page.getByRole("button", { name: "clear Clear cache" }).click();
  await expect(
    page.getByText("Successfully cleared the cache").first()
  ).toBeVisible();

  const cacheData = await page.evaluate(() => localStorage.getItem("cacheKey"));
  expect(cacheData).toBeNull();
};

test.beforeEach(async ({ page }) => {
  await login(page, "shogun", "shogun", "playwright/.auth/admin.json");
});

test.use({
  storageState: "playwright/.auth/admin.json",
});

test("globalConfig", async ({ page }) => {
  await page.goto("/admin/portal");

  await globalConfig(page);

  console.log("Global configuration test completed.");
  if (page) await page.close();
});
