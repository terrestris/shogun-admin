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
        throw new Error('Element not found and no more pages to search.');
      }
  
      await nextPageButton.click();
      await page.waitForLoadState('networkidle'); 
      await page.waitForSelector('.ant-table-row'); 
    }
  
    const rowContentLayer = await targetRowLayer.innerText();
    console.log('Found:', rowContentLayer);
    return rowContentLayer;
  };
  