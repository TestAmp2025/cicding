import { expect } from '@playwright/test';
import { shopUser } from '../../test-data/credentials.js';

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.addToCartFirst = page.getByRole('button', { name: /add to cart/i }).first();
    this.cartLink = page.getByRole('link', { name: /cart/i }).or(page.locator("a[href='/cart']"));
    this.continueCheckout = page.locator("//button[text()='Continue to checkout']");

    // Login
    this.email = page.getByRole('textbox', { name: /email/i });
    this.password = page.getByLabel(/password/i);
    this.loginBtn = page.getByRole('button', { name: /login/i });

    // Billing
    this.billingHeading = page.getByRole('heading', { name: /billing details/i });
    this.firstName = page.locator("//label[contains(.,'First name')]/following-sibling::input");
    this.lastName  = page.locator("//label[contains(.,'Last name')]/following-sibling::input");
    this.street    = page.locator("//input[@placeholder='House number and street name']");
    this.city      = page.locator("//input[@name='town']");
    this.stateOpen = page.getByPlaceholder('Choose state');
    this.zip       = page.locator("//input[@name='zip']");
    this.phone     = page.locator("//input[@name='phone']");
    this.emailBill = page.locator("//input[@name='email']");

    // Payment
    this.cardNo    = page.getByRole('textbox', { name: /card number|cardno/i }).or(page.locator("input[name='cardNo']"));
    this.expiry    = page.getByRole('textbox', { name: /expiry|mm\/yy/i }).or(page.locator("label:has-text('Expiry') + input"));
    this.ccv       = page.locator("input[name='ccv']");
    this.cardName  = page.getByRole('textbox', { name: /name on card|card name/i }).or(page.locator("input[name='cardName']"));

    this.submitBtn = page.getByRole('button', { name: /continue to payment/i });
    this.success   = page.getByText(/order is successful/i);
  }

  async startCheckoutFlow(creds = shopUser) {
    await this.page.goto('https://mini-shop.testamplify.com/');
    await expect(this.page).toHaveTitle(/mini/i);
    await this.addToCartFirst.click();
    await this.cartLink.click();
    await expect(this.page).toHaveURL("https://mini-shop.testamplify.com/cart");
    await this.continueCheckout.click();

    await this.email.fill(creds.email);
    await this.password.fill(creds.password);
    await this.loginBtn.click();
    await this.continueCheckout.click();
    await expect(this.billingHeading).toBeVisible();
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  async fillBilling(c) {
    await this.firstName.fill(c.first);
    await this.lastName.fill(c.last);
    await this.street.fill(c.street);
    await this.city.fill(c.city);
    await this.stateOpen.click();
    await this.page.getByRole('option', { name: c.state }).or(this.page.getByText(c.state, { exact: true })).click();
    await this.zip.fill(c.zip);
    await this.phone.fill(c.phone);
    await this.emailBill.fill(c.email);
  }

  async fillPayment(p) {
    await this.cardNo.fill(p.cardNo);
    await this.expiry.fill(p.expiry);
    await this.ccv.fill(p.ccv);
    await this.cardName.fill(p.cardName);
  }

  async submitAndAssert() {
    await this.submitBtn.click();
    await expect(this.page).toHaveURL(/\/checkout\/success$/);
    await expect(this.success).toBeVisible();
  }
}
