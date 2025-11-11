import { test, expect } from './fixtures/test-with-logger.js';
import { ShopLandingPage } from '../pages/shop/ShopLandingPage.js';
import { BankLoginPage } from '../pages/bank/BankLoginPage.js';
import { bankUser } from '../test-data/credentials.js';

test('Shop landing opens and Products is reachable', async ({ page }) => {
  console.log('Opening Mini Shop landing page...');
  const shop = new ShopLandingPage(page);
  await shop.goto();
  await shop.assertLoaded();
  await shop.openProducts();
  await expect(page.getByRole('heading', { name: /all products/i })).toBeVisible();
});

test('Bank login page loads and rejects empty creds', async ({ page }) => {
  console.log('Testing Mini Bank login page...');
  const login = new BankLoginPage(page);
  await login.goto();
  await login.login({ email: bankUser.email, password: bankUser.password });
  await expect(page).toHaveURL(/\/login/);
});