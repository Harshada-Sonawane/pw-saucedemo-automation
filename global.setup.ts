import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

console.log('Global setup is running');
export default async function globalSetup() {
  mkdirSync('playwright/.auth', { recursive: true });

  // const browser = await chromium.launch();
  const browser = await chromium.launch({
  headless: false,
  slowMo: 500,
});

  try {
    const page = await browser.newPage();

    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for login to finish before saving the state.
    await page.waitForURL('**/inventory.html');

    await page.context().storageState({
      path: 'playwright/.auth/user.json',
    });
  } finally {
    await browser.close();
  }
}