// tests/fixtures/test-with-logger.js
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  _consolePatch: [async ({}, use, testInfo) => {
    // Save originals
    const oLog  = console.log;
    const oInfo = console.info;
    const oWarn = console.warn;
    const oErr  = console.error;

    const stamp = () => {
      const time = new Date().toLocaleTimeString();
      return `[${time}] [${testInfo.title}]`;
    };

    // Patch
    console.log  = (...args) => oLog (stamp(), ...args);
    console.info = (...args) => oInfo(stamp(), ...args);
    console.warn = (...args) => oWarn(stamp(), ...args);
    console.error= (...args) => oErr (stamp(), ...args);

    await use(); // run the test

    // Restore
    console.log  = oLog;
    console.info = oInfo;
    console.warn = oWarn;
    console.error= oErr;
  }, { auto: true }],
});

export { expect };
