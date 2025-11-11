import { expect } from '@playwright/test';

export class ShopLandingPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.startShoppingBtn = page.getByRole('button', { name: /start shopping now/i });
    this.productsLink = page.getByRole('link', { name: /^products$/i }).first();
    this.searchBox = page.getByPlaceholder('Search product, or category');
  }

  async goto() {
    await this.page.goto('https://mini-shop.testamplify.com/');
  }

  async assertLoaded() {
    await expect(this.page).toHaveTitle("Minishop");
    await expect(this.searchBox).toBeVisible();
  }

  async openProducts() {
    await this.productsLink.click();
    await expect(this.page).toHaveURL(/\/products/);
  }
}
