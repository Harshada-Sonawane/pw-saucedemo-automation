import { test, expect } from '../fixtures/pageFixtures';
import { users } from '../test-data/testData';

// Every test in this file starts without the saved login.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Sauce Demo login', () => {
  test('logged-out user can see the login page', async ({ loginPage }) => {
    await loginPage.open();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('user can log in with valid credentials', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.productsHeading).toBeVisible();
  });

  test('user cannot log in with an invalid password', async ({
    page,
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.login(users.invalidPassword.username, users.invalidPassword.password);

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match'
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('locked-out user cannot log in', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.locked.username, users.locked.password);

    await expect(loginPage.errorMessage).toContainText(
      'this user has been locked out'
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('username is required', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.enterPassword(users.standard.password);
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText(
      'Username is required'
    );
  });

  test('password is required', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.enterUsername(users.standard.username);
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText(
      'Password is required'
    );
  });
});