import { test } from '@playwright/test';
import { IframePage } from '../../pages/heroku/IframePage.js';

test('Iframe: type inside the editor', async ({ page }) => {
  const iframe = new IframePage(page);
  await iframe.goto();
  await iframe.checkEditor();
  await iframe.expectEditorContains('Your content goes here.');
});
