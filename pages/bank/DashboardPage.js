import { expect } from '@playwright/test';

export class DashboardPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.overview = page.getByRole('heading', { name: /overview/i });

    // Transaction / deposit flow
    this.startTransaction = page.getByRole('button', { name: /start a transaction/i });
    this.makeDeposit = page.locator("//a[@href='/dashboard/deposit']");
    this.bankTransfer = page.getByText('Bank Transfer');
    this.amountInput = page.getByRole('spinbutton').or(page.getByRole('textbox', { name: /amount/i }));
    this.continueStep3 = page.locator("//button[text()='Step 3 — Continue']");
    this.successToast = page.getByText(/success|deposited/i);
    this.goToDashboard = page.locator("//a/button[text()=' Go to dashboard']");
    
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.overview).toBeVisible();
  }

  async makeDepositFlow(amount) {
    await this.startTransaction.click();
    await this.makeDeposit.click();
    await expect(this.page).toHaveURL(/deposit/i);
    await this.bankTransfer.click();
    await this.amountInput.fill(String(amount));
    await this.continueStep3.click();
    await expect(this.successToast).toBeVisible();
    await this.goToDashboard.click();
  }
}