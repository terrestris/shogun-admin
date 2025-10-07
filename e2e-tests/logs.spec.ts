import { test, expect } from "@playwright/test";
import { login, switchLanguage } from "./helpers";


export const logs = async (page: any) => {
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".language-select")).toBeVisible();
  await switchLanguage(page, "EN");

  await page.getByText("Status").click();
  await expect(page.getByText("Logs")).toBeVisible();
  await page.getByText("Logs").click();

  await expect(page.getByTitle(/^Logs$/)).toBeVisible();
  await expect(page.getByTitle(/^… that explain the world$/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  await expect(page.getByRole("switch")).toBeVisible();

  const logTextElement = page.locator(".log-container");
  await expect(logTextElement).toBeVisible();
  await expect(logTextElement).toHaveText(/INFO/);

  await page.getByText("Configuration").click();
  await page.getByText("Logging levels").click();
  await page
    .getByRole("row", { name: "com.graphql-java INFO" })
    .locator("span")
    .nth(2)
    .click();
  await page.getByTitle("DEBUG").locator("div").click();
  await expect(page.getByText("Successfully set log level")).toBeVisible();

  await page.locator("#app").getByTitle("DEBUG").click();
  await page
    .locator("div:nth-child(5) > .ant-select-item-option-content")
    .first()
    .click();
  await expect(
    page.getByText("Successfully set log level").first()
  ).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await login(page, "shogun", "shogun", "playwright/.auth/admin.json");
});

test.use({
  storageState: "playwright/.auth/admin.json",
});

test("logs", async ({ page }) => {
  await page.goto("/admin/portal");

  await logs(page);

  console.log("Logs test completed.");
  if (page) await page.close();
});
