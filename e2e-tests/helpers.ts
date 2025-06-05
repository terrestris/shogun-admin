export const findElementInPaginatedTable = async (page: any, text: string) => {
  let targetRowLayer;

  while (true) {
    targetRowLayer = await page.locator('.ant-table-row').filter({
      hasText: text
    }).first();

    if (await targetRowLayer.isVisible()) {
      break;
    }

    const nextPageButton = page.getByRole('listitem', { name: 'Next page', exact: true }).getByRole('button');
    if (!(await nextPageButton.isEnabled())) {
      throw new Error(`Element with text "${text}" not found in the table after checking all pages.`);
    }

    await nextPageButton.scrollIntoViewIfNeeded();
    await nextPageButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.ant-table-row');
  }

  const rowContentLayer = await targetRowLayer.innerText();
  console.log('Found:', rowContentLayer);
  return rowContentLayer;
};

export const deleteAllRowsWithText = async (page: any, text: string) => {
  while (true) {
    let rowContent;

    try {
      rowContent = await findElementInPaginatedTable(page, text);
    } catch (error) {
      console.log(`No more rows found with text: "${text}"`);
      break;
    }
    
    const matchingRows = await page.locator('.ant-table-row').filter({
      hasText: text
    });
    const rowCount = await matchingRows.count();

    console.log(`Found ${rowCount} rows with text: "${text}"`);

    for (let i = 0; i < rowCount; i++) {
      const row = matchingRows.first();
      await row.waitFor({ state: 'visible' });
      const deleteButton = text.includes('Application')
      ? row.locator('div svg').nth(1)
      : row.locator('div svg').first();

      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForLoadState('networkidle');

        await page.getByRole('dialog').getByRole('textbox').fill(text);     
        await page.getByRole('button', { name: 'OK' }).click();
        await page.waitForSelector('.ant-notification-notice', { state: 'visible' });
        await page.waitForLoadState('networkidle');
      } else {
        console.log(`Delete button for row ${i + 1} is not visible.`);
      }
    }
  }
};
