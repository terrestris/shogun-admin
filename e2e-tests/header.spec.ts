import { test, expect } from "@playwright/test";
import { login, switchLanguage } from "./helpers";

// import { header } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/header';

export const header = async (page: any) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(".header-logo", {
    state: "visible",
    timeout: 60000,
  });
  const logo = await page.locator(".header-logo");
  await expect(logo).toBeVisible();
  await expect(page.locator(".language-select")).toBeVisible();
  await expect(page.locator(".language-select")).toBeVisible();
  await switchLanguage(page, "EN");

  await page.waitForSelector(".user-menu", {
    state: "visible",
    timeout: 60000,
  });
  await expect(page.locator(".user-menu")).toBeVisible();
  await expect(page.locator(".portal")).toBeVisible();

  await page.locator(".user-menu").click();
  await expect(page.getByText(/^Profile settings$/)).toBeVisible();
  await expect(page.getByText(/^Info$/)).toBeVisible();
  await expect(page.getByText(/^Logout$/)).toBeVisible();

  await page.getByText("Profile settings").click();
  const settingsUrl = await page.url();
  await expect(settingsUrl).toContain("/auth/realms/");
  await expect(page.getByTestId("page-heading")).toBeVisible();
  await expect(page.getByText("Manage your basic information")).toBeVisible();
  await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
  await expect(page.getByText("Username")).toBeVisible();
  await expect(page.getByText("Email")).toBeVisible();
  await expect(page.getByText("First name")).toBeVisible();
  await expect(page.getByText("Last name")).toBeVisible();

  await page.goto("/admin/portal");
  await page.locator(".user-menu").click();
  await page.getByText("Info").click();
  await expect(page.getByLabel("About").locator("img")).toBeVisible();
  await expect(page.getByText("About")).toBeVisible();
  await expect(page.getByText("Admin version")).toBeVisible();
  await expect(page.getByText("Backend version")).toBeVisible();
  await page.getByLabel("Close", { exact: true }).first().click();
  await expect(page.getByLabel("About").locator("img")).not.toBeVisible();

  await page.locator(".user-menu").click();
  await page.getByText("Logout").click();
  await expect(
    page.getByRole("heading", { name: "Sign in to your account" })
  ).toBeVisible();
  const loginUrl = await page.url();
  await expect(loginUrl).toContain("/auth/realms/");
};

test.beforeEach(async ({ page }) => {
  await login(page, "shogun", "shogun", "playwright/.auth/admin.json");
});

test.use({
  storageState: "playwright/.auth/admin.json",
});

test("header", async ({ page }) => {
  await page.goto("/admin/portal");
  await page.waitForLoadState("networkidle");

  await header(page);

  console.log("Header test completed.");
  if (page) await page.close();
});
