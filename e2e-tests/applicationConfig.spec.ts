import { test, expect } from "@playwright/test";
import {
  deleteAllRowsWithText,
  findElementInPaginatedTable,
  login,
  switchLanguage,
} from "./helpers";
import { time } from "console";

// import { applicationConfig } from '@terrestris/shogun-e2e-tests/dist/shogun-admin-client/applicationConfig';

export const applicationConfig = async (page: any) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(".header-logo", {
    state: "visible",
    timeout: 60000,
  });
  await expect(page.locator(".language-select")).toBeVisible();
  await switchLanguage(page, "EN");

  await page.waitForSelector(".user-menu", {
    state: "visible",
    timeout: 60000,
  });
  await expect(page.locator(".user-menu")).toBeVisible();

  await page.getByRole("menuitem", { name: "appstore Layers" }).click();
  await page.getByRole("button", { name: "form Create Layer" }).click();
  await page.getByLabel("Name").nth(1).fill("Test Config Layer Playwright");
  await page.getByRole("button", { name: "save Save Layer" }).click();
  await expect(page.getByText("Layer successfully saved")).toBeVisible();
  await page.getByLabel("Close", { exact: true }).first().click();

  const rowContentLayer = await findElementInPaginatedTable(
    page,
    "Test Config Layer Playwright"
  );
  const layerID: String = rowContentLayer.match(/\d+/)?.[0];

  await page
    .getByRole("menuitem", { name: "bank Application" })
    .locator("span")
    .first()
    .click();
  await page.getByRole("button", { name: "form Create Application" }).click();
  await page.getByLabel("Name").nth(1).fill("Test Config Application Playwright");

  await page.getByRole("button", { name: "fullscreen" }).first().click();
  await expect(page.locator(".monaco-editor").first()).toBeVisible();
  const lineElement = page.locator("div").filter({ hasText: /^\{$/ });
  await lineElement.waitFor({ state: "visible", timeout: 10000 });
  await lineElement.scrollIntoViewIfNeeded();
  const isClickable = await lineElement.isEnabled();
  const isHidden = await lineElement.isHidden();

  if (!isClickable || isHidden) {
    throw new Error("The element is not clickable.");
  }
  await lineElement.click({ force: true });

  await page.context().grantPermissions(["clipboard-write"]);
  await page.evaluate(async () => {
    await navigator.clipboard.writeText(`, "defaultLanguage": "de"`);
  });

  await page.bringToFront();
  const textLocation = page.locator(".view-lines > div:nth-child(26)");
  await textLocation.scrollIntoViewIfNeeded();
  await textLocation.click({ force: true });
  // for (let i = 0; i < 5; i++) {
  //   await page.keyboard.press('ArrowRight', { delay: 10 });
  // }
  await page.keyboard.press("Enter");
  await page.keyboard.press("Control+V");

  await page.getByRole("button", { name: "menu-unfold" }).first().click();
  await page.getByRole("button", { name: "save Save Application" }).click();
  await expect(page.getByTitle(/^Layertree$/)).toBeVisible();

  await page.getByRole("button", { name: "fullscreen" }).nth(1).click();
  await expect(page.locator(".monaco-editor").first()).toBeVisible();
  const jsonEditor =
    "div:nth-child(8) > .ant-row > div:nth-child(2) > .ant-form-item-control-input >" +
    ".ant-form-item-control-input-content > .fs-wrapper > .json-editor > section > div > .monaco-editor >" +
    ".overflow-guard > div:nth-child(2) > .lines-content > .view-lines > .view-line";
  await page.locator(jsonEditor).click();
  // eslint-disable-next-line no-shadow
  await page.evaluate((layerID) => {
    navigator.clipboard.writeText(`{
      "title": "root",
      "children": [
        {
          "title": "Test Layer",
          "checked": true,
          "layerId": ${layerID}
        }
      ]
    }
      `);
  }, layerID);
  await page.bringToFront();
  await page.keyboard.press("Control+V");
  const editor = page.getByLabel("Editor content").nth(1);
  await editor.click({ force: true });
  await editor.press("ControlOrMeta+Space");
  await expect(page.getByLabel("Suggest").locator("a")).toBeVisible();

  await page.getByRole("button", { name: "save Save Application" }).click();
  await expect(
    page.getByText("Application successfully saved").first()
  ).toBeVisible();
  await page.locator(".ant-notification-notice-close").click();
  await expect(page.getByTitle(/^Configure Tools$/)).toBeVisible();

  await page.getByRole("button", { name: "fullscreen" }).nth(3).click();
  await expect(page.locator(".monaco-editor").first()).toBeVisible();
  // await page.locator('.view-lines > div:nth-child(27)').click({ force: true });
  await page.getByText("true").nth(1).click();
  for (let i = 0; i <= 1; i++) {
    await page.keyboard.press("Backspace");
  }
  for (let i = 0; i <= 1; i++) {
    await page.keyboard.press("Delete");
  }
  await page.keyboard.type("false");
  await page.bringToFront();

  await page.getByRole("button", { name: "save Save Application" }).click();
  await expect(page.getByText("Application successfully saved")).toBeVisible();
  await page.getByLabel("Close", { exact: true }).first().click();

  let pageNumberApp = 2;
  let applicationID: string | undefined;
  let elementFoundApp = false;

  while (!elementFoundApp) {
    try {
      const targetRow = await page
        .locator(".ant-table-row")
        .filter({
          hasText: "Test Config Application Playwright",
        })
        .first();
      await targetRow.waitFor({ state: "visible", timeout: 10000 });

      const rowContent = await targetRow.innerText();
      applicationID = rowContent.match(/\d+/)?.[0];
      elementFoundApp = true;
    } catch (error) {
      const pageButton = page
        .getByText(pageNumberApp.toString(), { exact: true })
        .first();
      await pageButton.click();
      pageNumberApp++;

      if (pageNumberApp > 10) {
        throw new Error("Row not found after checking all pages.");
      }
    }
  }

  if (!applicationID) {
    throw new Error("Application ID could not be extracted.");
  }

  await page.goto(`/client/?applicationId=${applicationID}`);
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.getByText("Messen")).not.toBeVisible();
  await expect(page.getByText("Karten").first()).toBeVisible();
  await page
    .getByRole("button", { name: "collapsed Karten", exact: true })
    .click();
  await expect(page.getByText("Test Layer")).toBeVisible();

  await page.goto("/admin/portal");
  await page.waitForSelector(".header-logo", {
    state: "visible",
    timeout: 60000,
  });
  await page
    .getByRole("menuitem", { name: "bank Application" })
    .locator("span")
    .first()
    .click();

  await page.waitForLoadState("networkidle");
  await page.waitForSelector(".ant-table-row", { state: "visible" });
  await deleteAllRowsWithText(page, "Test Config Application Playwright");

  await page.getByText("Layers", { exact: true }).first().click();
  await page.getByText("/ Page").click();
  await page.getByRole("option", { name: "10 / Page" }).locator("div").click();

  await page.waitForSelector(".ant-table-row", { state: "visible" });
  await deleteAllRowsWithText(page, "Test Config Layer Playwright");
};

test.beforeEach(async ({ page }) => {
  await login(page, "shogun", "shogun", "playwright/.auth/admin.json");
});

test.use({
  storageState: "playwright/.auth/admin.json",
});

test("applicationConfig", async ({ page }) => {
  await page.goto("/admin/portal");
  await page.waitForLoadState("networkidle");

  await applicationConfig(page);

  console.log("Application configuration test completed.");
  if (page) await page.close();
});
