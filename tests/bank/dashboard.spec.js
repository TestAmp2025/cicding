// tests/bank/dashboard.spec.js
import { test, expect } from '../fixtures/test-with-logger.js';
import { BankLoginPage } from '../../pages/bank/BankLoginPage.js';
import { DashboardPage } from '../../pages/bank/DashboardPage.js';
import { bankUser } from '../../test-data/credentials.js';

test('Bank – login and verify transactions (POM)', async ({ page }) => {
  // Login
  const login = new BankLoginPage(page);
  await login.goto();
  await login.login({ email: bankUser.email, password: bankUser.password });


  // Dashboard checks
  const dashboard = new DashboardPage(page);
  await dashboard.assertLoaded();

  // Go to transactions and wait for amounts to load
  await dashboard.openTransactions();
  await dashboard.waitForAmounts();

  // Optional extra assertion
  await expect(page.getByRole('heading', { name: /transactions/i })).toBeVisible();
});
