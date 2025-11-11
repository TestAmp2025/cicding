// pages/heroku/IframePage.js
import { expect } from '@playwright/test';

export class IframePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.closeInfo = page.locator("//button[@class='tox-notification__dismiss tox-button tox-button--naked tox-button--icon']");
    this.editorFrame = page.frameLocator('iframe[id="mce_0_ifr"]');
    this.editorBody = this.editorFrame.locator("//p[text()='Your content goes here.']");
    this.heading = page.getByRole('heading', { name: 'An iFrame containing the TinyMCE WYSIWYG Editor' });
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/iframe');
    await expect(this.heading).toBeVisible();
  }

  async checkEditor() {
    await this.closeInfo.click();
  }

  async expectEditorContains(text) {
    await expect(this.editorBody).toContainText(text);
  }
}
