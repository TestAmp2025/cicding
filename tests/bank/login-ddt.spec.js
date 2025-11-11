import { test, expect } from '../fixtures/test-with-logger.js';
import { BankLoginPage } from '../../pages/bank/BankLoginPage.js';
import { DashboardPage } from '../../pages/bank/DashboardPage.js';
import { bankUsers } from '../../test-data/credentials.js';

test.describe('Mini Bank – Data Driven Login', () => {
  for (const u of bankUsers) {
    test(`login test for ${u.email}`, async ({ page }) => {
      const login = new BankLoginPage(page);
      await login.goto();
      await login.login({ email: u.email, password: u.password });

      if (u.expectSuccess) {
        const dash = new DashboardPage(page);
        await dash.assertLoaded();
      } else {
        await expect(page).toHaveURL(/\/login/);
      }
    });
  }
});
