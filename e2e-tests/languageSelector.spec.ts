import { test, expect } from "@playwright/test";
import { login } from "./helpers";


export const languageSelector = async (page: any) => {
  await page.waitForLoadState("networkidle");
  const logo = await page.locator(".header-logo");
  await expect(logo).toBeVisible();
  const selector = await page.locator(".language-select");
  await expect(selector).toBeVisible();

  const initialLanguage = await page.locator(".language-select").innerText();
  const initialTitle = await page
    .locator(".ant-menu-title-content")
    .first()
    .innerText();

  await expect(
    page.locator(".language-select").filter({
      hasText: initialLanguage.toString(),
    })
  ).toBeVisible();
  await expect(
    page.locator(".ant-menu-title-content").filter({
      hasText: initialTitle.toString(),
    })
  ).toBeVisible();

  await page.locator(".language-select").click();

  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");

  const changedLanguage = await page.locator(".language-select").innerText();
  const changedTitle = await page
    .locator(".ant-menu-title-content")
    .first()
    .innerText();

  await expect(
    page.locator(".language-select").filter({
      hasText: changedLanguage[0].toString(),
    })
  ).toBeVisible();
  await expect(
    page.locator(".ant-menu-title-content").filter({
      hasText: changedTitle.toString(),
    })
  ).toBeVisible();

  await expect(initialLanguage).not.toEqual(changedLanguage);
  await expect(initialTitle).not.toEqual(changedTitle);
};

test.beforeEach(async ({ page }) => {
  await login(page, "shogun", "shogun", "playwright/.auth/admin.json");
});

test.use({
  storageState: "playwright/.auth/admin.json",
});

test("languageSelector", async ({ page }) => {
  await page.goto("/admin/portal");
  await page.waitForLoadState("networkidle");

  await languageSelector(page);

  console.log("Language can be selected via the language selector menu.");
  if (page) await page.close();
});
