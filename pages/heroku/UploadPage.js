// pages/heroku/UploadPage.js
import { expect } from '@playwright/test';

export class UploadPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.fileInput = page.locator('input#file-upload');
    this.uploadBtn = page.locator('input#file-submit');
    this.resultHeader = page.getByRole('heading', { name: 'File Uploaded!' });
    this.uploadedFiles = page.locator('#uploaded-files');
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/upload');
  }

  async upload(filePath) {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadBtn.click();
  }

  async expectUploaded(filename) {
    await expect(this.resultHeader).toBeVisible();
    await expect(this.uploadedFiles).toHaveText(filename);
  }
}
