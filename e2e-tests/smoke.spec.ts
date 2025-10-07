import { test, expect, request } from "@playwright/test";
import { switchLanguage } from "./helpers";

test.describe("Frontend Smoke Checks", () => {
  test.use({ storageState: "playwright/.auth/admin.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/portal");
    await expect(page.locator(".language-select")).toBeVisible();
    await switchLanguage(page, "EN");
  });

  test("Landing page loads and shows main UI", async ({ page }) => {
    await expect(page.locator(".header-logo")).toBeVisible();
    await expect(page.locator(".user-menu")).toBeVisible();
    await expect(page.locator(".portal")).toBeVisible();
  });

  test("Layers page loads and can open create dialog", async ({ page }) => {
    await page.getByText("Layers", { exact: true }).first().click();
    await expect(
      page.getByRole("button", { name: "form Create Layer" })
    ).toBeVisible();
    await page.getByRole("button", { name: "form Create Layer" }).click();
    await expect(page.getByLabel("Name").nth(1)).toBeVisible();
  });

  test("Applications page loads", async ({ page }) => {
    await page.getByText("Applications", { exact: true }).first().click();
    await expect(
      page.getByRole("button", { name: "form Create Application" })
    ).toBeVisible();
  });

  test("Configuration page loads", async ({ page }) => {
    await page.getByText("Configuration", { exact: true }).first().click();
    await expect(page.getByText("Global")).toBeVisible();
  });
});
