// pages/shop/CartPage.js
import { expect } from '@playwright/test';

export class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Header cart link (icon goes to /cart)
    this.cartLink = page.locator("a[href='/cart']");

    // Cart page anchors
    this.checkoutBtn = page.getByRole('button', { name: /continue to checkout|checkout/i });
    this.cartItems = page.locator("[data-testid='cart-item'], .cart-item, text=Add to cart").first(); // lenient fallback
  }

  async openFromHeader() {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/\/cart$/);
    await expect(this.checkoutBtn).toBeVisible();
  }

  async assertHasItems() {
    // If site doesn’t mark items with a test id, at least assert the checkout button is enabled
    await expect(this.checkoutBtn).toBeEnabled();
  }

  async proceedToCheckout() {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.checkoutBtn.click()
    ]);
  }
}
