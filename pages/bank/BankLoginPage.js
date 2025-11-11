import { expect } from '@playwright/test';

export class BankLoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.email = page.getByRole('textbox', { name: /email/i });
    this.password = page.getByLabel(/password/i);
    this.loginBtn = page.getByRole('button', { name: /login/i });
    this.errorMsg = page.getByText(/invalid|incorrect|error/i); // loose match for failure
  }

  async goto() {
    await this.page.goto('https://mini-bank.testamplify.com/login');
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async login({ email, password }) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
  }
}