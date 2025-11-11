// pages/heroku/AlertsPage.js
import { expect } from '@playwright/test';

export class AlertsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.result = page.locator('#result');
    this.jsAlertBtn = page.getByRole('button', { name: 'Click for JS Alert' });
    this.jsConfirmBtn = page.getByRole('button', { name: 'Click for JS Confirm' });
    this.jsPromptBtn = page.getByRole('button', { name: 'Click for JS Prompt' });
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    await expect(this.page).toHaveURL(/javascript_alerts/);
  }

  async triggerAlertAccept() {
    this.page.once('dialog', d => d.accept());
    await this.jsAlertBtn.click();
  }

  async triggerConfirm(accept = true) {
    this.page.once('dialog', d => accept ? d.accept() : d.dismiss());
    await this.jsConfirmBtn.click();
  }

  async triggerPrompt(text = 'Hello') {
    this.page.once('dialog', d => d.accept(text));
    await this.jsPromptBtn.click();
  }

  async expectResultContains(text) {
    await expect(this.result).toContainText(text);
  }
}
