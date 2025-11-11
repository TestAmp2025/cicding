// pages/heroku/EntryAdPage.js
import { expect } from '@playwright/test';

export class EntryAdPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.modal = page.locator("//*[text()='This is a modal window']");
    this.closeBtn = page.locator("//*[text()='Close']");
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/entry_ad');
  }

  async waitForModal() {
    // Modal may show after a small delay
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.modal).toBeVisible();
  }

  async closeModal() {
    await this.closeBtn.click();
    await expect(this.modal).toBeHidden();
  }
}
