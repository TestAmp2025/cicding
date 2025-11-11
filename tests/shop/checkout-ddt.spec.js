import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/shop/CheckoutPage.js';
import { customers } from '../../test-data/customers.js';

test.describe('Shop – Data Driven Checkout', () => {
  test.describe.configure({ mode: 'serial' }); // simple: avoid shared cart conflicts

  for (const c of customers) {
    test(`checkout for ${c.first} ${c.last}`, async ({ page }) => {
      const checkout = new CheckoutPage(page);
      await checkout.startCheckoutFlow();     // adds product, handles login if needed, lands /checkout
      await checkout.fillBilling(c);
      await checkout.fillPayment({
        cardNo: '4242424242424242',
        expiry: '10/26',
        ccv: '200',
        cardName: `${c.first} ${c.last}`,
      });
      await checkout.submitAndAssert();
      await expect(page.getByText(/order is successful/i)).toBeVisible();
    });
  }
});
