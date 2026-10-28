import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global.setup.ts',

  use: {
    baseURL: 'https://www.saucedemo.com',
    storageState: 'playwright/.auth/user.json',
    headless: false,
    launchOptions: {
      slowMo: 1000, 
    },
  },
});