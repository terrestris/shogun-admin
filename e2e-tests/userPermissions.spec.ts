import { test, expect } from "@playwright/test";
import { deleteAllRowsWithText, login, switchLanguage } from "./helpers";

// import { userPermissions } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/userPermissions';

export const userPermissions = async (page: any) => {
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".language-select")).toBeVisible();
  await switchLanguage(page, "EN");

  await expect(
    page.getByRole("link", { name: "bank Applications … that move" })
  ).toBeVisible();
  await page
    .getByRole("menuitem", { name: "bank Application" })
    .locator("span")
    .first()
    .click();
  page.getByRole("button", { name: "form Create Application" }).click();
  await page
    .getByLabel("Name")
    .fill("Test Application userPermission Playwright");
  await page.getByRole("button", { name: "save Save Application" }).click();
  await expect(page.getByText("Application successfully saved")).toBeVisible();

  await page.getByRole("button", { name: "plus" }).nth(2).click();
  await page
    .locator(
      ".ant-form-item-control-input-content > .ant-select > .ant-select-selector"
    )
    .first()
    .click();
  await page.getByRole("combobox", { name: "Role name" }).fill("admin");
  await page.getByRole("combobox", { name: "Role name" }).press("Enter");
  await page.getByRole("button", { name: "OK" }).click();
  await expect(page.getByText("Please enter Permission")).toBeVisible();
  await page.getByRole("combobox", { name: "Permission" }).click();
  await page.getByText("Read", { exact: true }).click();
  await page.getByRole("button", { name: "OK" }).click();

  await page.locator("#application").getByTitle("Read").click();
  await page.getByText("Update", { exact: true }).click();
  await page.locator("#application").getByTitle("Update").click();
  await page.getByText("Update & Delete").click();
  await page.locator("#application").getByTitle("Update & Delete").click();
  await page.getByText("Owner").nth(1).click();
  const deleteIcon = page
    .locator("#application")
    .locator(".ant-table")
    .nth(2)
    .locator("svg")
    .nth(2);
  await expect(deleteIcon).toBeVisible();
  await deleteIcon.click();

  await page.waitForSelector(".ant-table-row", { state: "visible" });
  await deleteAllRowsWithText(
    page,
    "Test Application userPermission Playwright"
  );
};

test.beforeEach(async ({ page }) => {
  await login(page, "shogun", "shogun", "playwright/.auth/admin.json");
});

test.use({
  storageState: "playwright/.auth/admin.json",
});

test("userPermissions", async ({ page }) => {
  await page.goto("/admin/portal");

  await userPermissions(page);

  console.log("User permissions test completed.");
  if (page) await page.close();
});
