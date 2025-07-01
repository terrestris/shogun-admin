export const login = async (
  page: any,
  username: string,
  password: string,
  path: string
) => {
  // @ts-ignore
  await page.goto(
    `${process.env.HOST}/auth/realms/SHOGun` +
      "/protocol/openid-connect/auth?client_id=shogun-client" +
      `&redirect_uri=${process.env.HOST}` +
      "%2Fclient%2F%3FapplicationId%3D21&state=9a983abe-3b0c-" +
      "41cb-9b7e-1d9120956959&response_mode=fragment&response_type" +
      "=code&scope=openid&nonce=72884466-0535-4a24-8c15-9e7f14d88a65"
  );

  if (await page.getByLabel("username").isVisible()) {
    // @ts-ignore
    await page.getByLabel("username").first().fill(username);
    // @ts-ignore
    await page.getByLabel("Password").first().fill(password);
    await page
      .getByRole("button", {
        name: "Sign in",
      })
      .click();
    // Save signed-in state to 'storageState.json'.
    await page.context().storageState({
      path: path,
    });
  }
};

export const switchLanguage = async (page: any, language: string) => {
  const languageIndicator = !(await page
    .locator("#root")
    .getByText(language)
    .isVisible());
  if (languageIndicator) {
    await page.locator(".language-select").click();
    await page
      .locator(".ant-select-item-option-content")
      .getByText(language, { exact: true })
      .click();
  }
};

export const findElementInPaginatedTable = async (page: any, text: string) => {
  let targetRowLayer;

  while (true) {
    targetRowLayer = await page
      .locator(".ant-table-row")
      .filter({
        hasText: text,
      })
      .first();

    if (await targetRowLayer.isVisible()) {
      break;
    }

    const nextPageButton = page
      .getByRole("listitem", { name: "Next page", exact: true })
      .getByRole("button");
    if (!(await nextPageButton.isEnabled())) {
      throw new Error(
        `Element with text "${text}" not found in the table after checking all pages.`
      );
    }

    await nextPageButton.scrollIntoViewIfNeeded();
    await nextPageButton.click();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector(".ant-table-row");
  }

  const rowContentLayer = await targetRowLayer.innerText();
  return rowContentLayer;
};

export const deleteAllRowsWithText = async (page: any, text: string) => {
  while (true) {
    let rowContent;

    try {
      rowContent = await findElementInPaginatedTable(page, text);
    } catch (error) {
      break;
    }

    const matchingRows = await page.locator(".ant-table-row").filter({
      hasText: text,
    });
    const rowCount = await matchingRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = matchingRows.first();
      await row.waitFor({ state: "visible" });
      const deleteButton = text.includes("Application")
        ? row.locator("div svg").nth(1)
        : row.locator("div svg").first();

      if (await deleteButton.isVisible()) {
        await deleteButton.scrollIntoViewIfNeeded();
        await deleteButton.click();
        await page.waitForLoadState("networkidle");

        await page.getByRole("dialog").getByRole("textbox").fill(text);
        await page.getByRole("button", { name: "OK" }).click();
        await page.waitForSelector(".ant-notification-notice", {
          state: "visible",
        });
        await page.waitForLoadState("networkidle");
      } else {
        console.log(`Delete button for row ${i + 1} is not visible.`);
      }
    }
  }
};
