import { test, expect } from '@playwright/test';
import { DownloadPage } from '../../pages/heroku/DownloadPage.js';

test('Download: wait for download event', async ({ page }) => {
  const downloads = new DownloadPage(page);
  await downloads.goto();
  const { suggested } = await downloads.downloadFirstFile();

  // We at least confirm we got a non-empty filename
  expect(suggested && suggested.length > 0).toBeTruthy();
  console.log(suggested)
});
