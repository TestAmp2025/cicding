// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // 🕒 Global timeouts
  timeout: 30_000,
  expect: { timeout: 5_000 },

  retries: 0,

   // run tests in files in parallel
   fullyParallel: true,

   // let Playwright choose a good number of workers (parallel runs)
   // (you can override on CLI with --workers=6, etc.)
   workers: '100%',

  // 📦 Test output folders
  outputDir: 'test-results',
  reporter: [['html', { open: 'never' }]], // HTML report → ./playwright-report

  use: {
    // 💻 Full HD viewport (simulates full-screen desktop)
    viewport: { width: 1920, height: 1080 },

    // ⏱ Action & navigation timeouts
    actionTimeout: 10_000,
    navigationTimeout: 20_000,

    // 🎥 Debug artifacts
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  //{ name: 'webkit',   use: { ...devices['Desktop Safari'] } },

  // 🌍 Multi-browser projects
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // runs real Microsoft Edge
      },
    },
  ],
});
