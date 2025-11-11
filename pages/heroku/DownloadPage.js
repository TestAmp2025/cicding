// pages/heroku/DownloadPage.js
import { expect } from '@playwright/test';

export class DownloadPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.firstFileLink = page.locator('#content a').first(); // any file link
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/download');
  }

  async downloadFirstFile() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.firstFileLink.click()
    ]);
    // Useful info:
    const suggested = download.suggestedFilename();
    const path = await download.path(); // may be null on CI, but ok locally
    return { suggested, path };
  }

  async expectDownloadedFilename(suggested) {
    // We just assert a filename exists (site serves random files)
    await expect.soft(suggested).toBeTruthy();
  }
}
