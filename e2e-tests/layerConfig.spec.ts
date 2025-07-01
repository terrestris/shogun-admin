import { test, expect } from "@playwright/test";
import { deleteAllRowsWithText, findElementInPaginatedTable, login, switchLanguage } from "./helpers";

// import { layerConfig } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/layerConfig';

export const layerConfig = async (page: any) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(".header-logo", {
    state: "visible",
    timeout: 60000,
  });
  const logo = await page.locator(".header-logo");
  await expect(logo).toBeVisible();
  await expect(page.locator(".language-select")).toBeVisible();
  await switchLanguage(page, "EN");

  await page.waitForSelector(".user-menu", {
    state: "visible",
    timeout: 60000,
  });
  await expect(page.locator(".user-menu")).toBeVisible();

  await page.getByText("Layers", { exact: true }).first().click();
  await page.getByRole("button", { name: "form Create Layer" }).click();
  await page.getByLabel("Name").fill("Test layerConfig Layer Playwright");
  await page.getByRole("button", { name: "save Save Layer" }).click();
  await expect(page.getByText("Layer successfully saved")).toBeVisible();
  await page.getByLabel("Close", { exact: true }).click();

  const rowContentLayer = await findElementInPaginatedTable(
    page,
    "Test layerConfig Layer Playwright"
  );
  const layerID: string = rowContentLayer.match(/\d+/)?.[0];

  if (!layerID) {
    throw new Error("Layer ID could not be extracted from row content.");
  }

  await page
    .getByRole("menuitem", { name: "bank Application" })
    .locator("span")
    .first()
    .click();
  await page.getByRole("button", { name: "form Create Application" }).click();
  await page.getByLabel("Name").fill("Test layerConfig Application Playwright");
  await page.getByRole("button", { name: "fullscreen" }).nth(1).click();
  await expect(page.locator(".monaco-editor").first()).toBeVisible();
  const jsonEditor =
    "div:nth-child(8) > .ant-row > div:nth-child(2) > .ant-form-item-control-input >" +
    ".ant-form-item-control-input-content > .fs-wrapper > .json-editor > section > div > .monaco-editor >" +
    ".overflow-guard > div:nth-child(2) > .lines-content > .view-lines > .view-line";
  await page.locator(jsonEditor).click();
  await page.waitForLoadState("networkidle");
  const jsonContent = `{
    "title": "root",
    "children": [
      {
        "title": "Test Layer",
        "checked": true,
        "layerId": ${layerID}
      `;

  const editor = await page.locator(jsonEditor);
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(jsonContent, { delay: 10 });
  await page.getByRole("button", { name: "save Save Application" }).click();
  await expect(
    page.getByText("Application successfully saved").first()
  ).toBeVisible();
  await page.locator(".ant-notification-notice-close").click();
  await expect(page.getByTitle(/^Configure Tools$/)).toBeVisible();

  const targetRow = await page
    .locator(".ant-table-row")
    .filter({
      hasText: "Test layerConfig Application Playwright",
    })
    .first();
  const rowContent = await targetRow.innerText();
  const applicationID = rowContent.match(/\d+/)?.[0];

  await page.goto(`/client/?applicationId=${applicationID}`);
  await expect(page.locator("#map")).toBeVisible();
  await page
    .getByRole("button", { name: "collapsed Maps", exact: true })
    .click();
  await expect(page.getByText("Test Layer", { exact: true })).toBeVisible();

  await page.goto("/admin/portal");
  await page
    .getByRole("menuitem", { name: "bank Application" })
    .locator("span")
    .first()
    .click();
  await page.waitForSelector(".ant-table-row", { state: "visible" });
  await deleteAllRowsWithText(page, "Test layerConfig Application Playwright");

  await page.getByText("Layers", { exact: true }).first().click();

  await page.waitForSelector(".ant-table-row", { state: "visible" });
  await deleteAllRowsWithText(page, "Test layerConfig Layer Playwright");
};

test.beforeEach(async ({ page }) => {
  await login(page, "shogun", "shogun", "playwright/.auth/admin.json");
});

test.use({
  storageState: "playwright/.auth/admin.json",
});

test("layerConfig", async ({ page }) => {
  await page.goto("/admin/portal");

  await layerConfig(page);

  console.log("Layer configuration test completed.");
  if (page) await page.close();
});
