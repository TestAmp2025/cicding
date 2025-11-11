import { test, expect } from '@playwright/test';
import { BankLoginPage } from '../../pages/bank/BankLoginPage.js';
import { DashboardPage } from '../../pages/bank/DashboardPage.js';
import { bankUsers } from '../../test-data/credentials.js';
import { deposits } from '../../test-data/deposits.js';

test('Bank – 5 deposits for first valid user', async ({ page }) => {
  const valid = bankUsers.find(u => u.expectSuccess);
  const login = new BankLoginPage(page);
  await login.goto();
  await login.login(valid);

  const dash = new DashboardPage(page);
  await dash.assertLoaded();

  for (const amt of deposits) {
    await dash.makeDepositFlow(amt);
  }

  await expect(page.getByRole('heading', { name: /overview/i })).toBeVisible();
});