import { expect, Locator } from '@playwright/test';

export const login = async (
  page: any,
  username: string | undefined,
  password: string | undefined,
  path: string
) => {
  await page.goto(
    `${process.env.HOST}/auth/realms/SHOGun` +
    '/protocol/openid-connect/auth?client_id=shogun-client' +
    `&redirect_uri=${process.env.HOST}` +
    '%2Fclient%2F%3FapplicationId%3D21&state=9a983abe-3b0c-' +
    '41cb-9b7e-1d9120956959&response_mode=fragment&response_type' +
    '=code&scope=openid&nonce=72884466-0535-4a24-8c15-9e7f14d88a65',
    {
      timeout: 60000,
      waitUntil: 'domcontentloaded',
    }
  );

  if (!username || !password) {
    throw new Error('Username or password is not defined in environment variables.');
  };

  const usernameField = page.getByLabel('username').first();
  const usernameVisible = await usernameField
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (usernameVisible) {
    await usernameField.fill(username);
    await page.getByLabel('Password').first().fill(password);
    await page
      .getByRole('button', {
        name: 'Sign in',
      })
      .click();
    await page.waitForURL(/\/client\/\?applicationId=\d+/, { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');

    // Save signed-in state to 'storageState.json'.
    await page.context().storageState({
      path: path,
    });
  } else {
    // Keep navigation deterministic when session restoration auto-redirects.
    await Promise.race([
      page.waitForURL(/\/client\/\?applicationId=\d+/, { timeout: 60000 }),
      page.waitForURL(/\/admin\/portal/, { timeout: 60000 }),
    ]).catch(() => undefined);
    await page.waitForLoadState('domcontentloaded');
  }
};

export const switchLanguage = async (page: any, language: string) => {
  const languageIndicator = !(await page
    .locator('#root')
    .getByText(language)
    .isVisible());
  if (languageIndicator) {
    await page.locator('.language-select').click();
    await page
      .locator('.ant-select-item-option-content')
      .getByText(language, { exact: true })
      .click();
  }
};

export const findElementInPaginatedTable = async (page: any, text: string) => {
  let targetRowLayer;

  while (true) {
    targetRowLayer = await page
      .locator('.ant-table-row')
      .filter({
        hasText: text,
      })
      .first();

    if (await targetRowLayer.isVisible()) {
      break;
    }

    const nextPageButton = page
      .getByRole('listitem', { name: 'Next page', exact: true })
      .getByRole('button');
    if (!(await nextPageButton.isEnabled())) {
      throw new Error(
        `Element with text '${text}' not found in the table after checking all pages.`
      );
    }

    await nextPageButton.scrollIntoViewIfNeeded();
    await nextPageButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.ant-table-row');
  }

  const rowContentLayer = await targetRowLayer.innerText();
  return rowContentLayer;
};

export const deleteAllRowsWithText = async (page: any, text: string) => {
  while (true) {
    try {
      await findElementInPaginatedTable(page, text);
    } catch {
      break;
    }

    const matchingRows = await page.locator('.ant-table-row').filter({
      hasText: text,
    });
    const rowCount = await matchingRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = matchingRows.first();
      if (row) {
        await row.waitFor({ state: 'visible' });
        const deleteButton = row.getByRole('img', { name: 'delete' }).first();

        const deleteVisible = await deleteButton
          .isVisible({ timeout: 5000 })
          .catch(() => false);

        if (deleteVisible) {
          await deleteButton.scrollIntoViewIfNeeded();
          await deleteButton.click({ force: true });

          const confirmDialog = page.locator('.ant-modal-confirm').last();
          const confirmVisible = await confirmDialog
            .isVisible({ timeout: 5000 })
            .catch(() => false);

          if (!confirmVisible) {
            continue;
          }

          await expect(confirmDialog).toBeVisible();
          await confirmDialog.getByRole('textbox').fill(text);
          const confirmButton = confirmDialog.getByRole('button', { name: 'OK' });
          await expect(confirmButton).toBeEnabled();
          await confirmButton.click({ force: true });
          await page.waitForSelector('.ant-notification-notice', {
            state: 'visible',
          });
          await page.waitForSelector('.ant-notification-notice [data-icon="close"]', {
            state: 'visible',
          });
          await page.locator('.ant-notification-notice [data-icon="close"]').first().click();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  }
};

export const writeToEditor = async (page: any, textLocation: any, inputText: string) => {
  await page.bringToFront();
  await textLocation.waitFor({ state: 'visible', timeout: 10000 });
  await textLocation.scrollIntoViewIfNeeded();
  const isClickable = await textLocation.isEnabled();
  const isHidden = await textLocation.isHidden();

  if (!isClickable || isHidden) {
    throw new Error('The element is not clickable.');
  }
  await textLocation.click({ force: true });

  await page.context().grantPermissions(['clipboard-write']);
  await page.evaluate(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, inputText);
  await page.bringToFront();

  await page.keyboard.press('Control+V');
};

export async function highlight(locator: Locator) {
  if (process.env.PW_DISABLE_HIGHLIGHT !== 'false') {
    return;
  }

  try {
    await locator.first().evaluate((el) => {
      el.style.outline = '2px solid #f4b400';
      el.style.backgroundColor = 'rgba(244, 180, 0, 0.2)';
      setTimeout(() => {
        el.style.outline = '';
        el.style.backgroundColor = '';
      }, 200);
    });
  } catch {
    // Highlighting is best-effort and must never fail the test flow.
  }
}
