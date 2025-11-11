import { test } from '@playwright/test';
import { EntryAdPage } from '../../pages/heroku/EntryAdPage.js';

test('Pop-up (Entry Ad): wait then close', async ({ page }) => {
  const entryAd = new EntryAdPage(page);
  await entryAd.goto();
  await entryAd.waitForModal();
  await entryAd.closeModal();
});
