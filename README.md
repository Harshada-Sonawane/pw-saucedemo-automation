# Playwright Login and POM Example

A beginner-friendly Playwright project using [Sauce Demo](https://www.saucedemo.com/). It demonstrates login reuse, Page Object Model (POM), custom fixtures, and login, product and checkout tests.

The public practice account is `standard_user` / `secret_sauce`. For a real application, use a secure credentials provider such as Jenkins Credentials.

## Project structure

```text
playwright-login-example/
├── fixtures/pageFixtures.ts
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── login.spec.ts
│   ├── dashboard.spec.ts
│   └── checkout.spec.ts
├── playwright/.auth/user.json  (created by setup)
├── global.setup.ts
├── playwright.config.ts
├── package.json
└── Jenkinsfile
```

## Installation and running

Install Node.js, open the project folder in VS Code, and run:

```powershell
npm.cmd install
npx.cmd playwright install chromium
npm.cmd test
```

The `.cmd` commands avoid the PowerShell script policy error encountered on Windows. To see a browser and run individual files:

```powershell
npx.cmd playwright test tests/login.spec.ts --headed
npx.cmd playwright test tests/dashboard.spec.ts --headed
npx.cmd playwright test tests/checkout.spec.ts --headed
```

For the full suite with a visible browser, run `npm.cmd test -- --headed`. View the report with `npx.cmd playwright show-report`.

## How login reuse works

1. `playwright.config.ts` tells Playwright to run `global.setup.ts`.
2. The setup logs in and saves authenticated browser state in `playwright/.auth/user.json`.
3. The config tells Playwright to load that state for tests.
4. Each test gets a fresh browser context initialized with the saved login.

Login tests start without the saved login, because they test login itself:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

The auth file may contain sensitive session data. Keep `playwright/.auth/` in `.gitignore` and do not upload it as a Jenkins artifact.

## Running from VS Code

Open the Testing sidebar and click the Play button beside a test. If a product or checkout test is redirected to login, run **Global Setup** from the Playwright sidebar to refresh the saved login. Enable **Run Global Setup on Each Run** if available in your extension version to refresh it automatically. This also runs setup for login tests, even though those tests clear saved state. Enable **Show Browsers** to see the test browser.

## Page Object Model

The `pages/` folder holds reusable locators and actions. Tests describe the scenario and check results.

- `LoginPage`: login fields, button and error message.
- `InventoryPage`: products, cart actions and sorting.
- `CartPage`: cart items and checkout action.
- `CheckoutPage`: customer details and order completion.

## Custom page fixtures

`fixtures/pageFixtures.ts` provides `loginPage`, `inventoryPage`, `cartPage` and `checkoutPage`. Import its custom `test` and request what you need:

```ts
import { test, expect } from '../fixtures/pageFixtures';

test('user can see products', async ({ inventoryPage }) => {
  await inventoryPage.open();
  await expect(inventoryPage.productsHeading).toBeVisible();
});
```

Page objects requested by the same test use the same Playwright page. Each test gets its own fresh browser context.

## Test scenarios

- Login: valid and invalid credentials, locked user and required fields.
- Products: display products, add and remove a product, and sort by price.
- Checkout: add a product, enter customer details and complete an order.

## Jenkins and multiple environments

The included `Jenkinsfile` is an example for QA and UAT. Before using it with a real application:

1. Add Jenkins username/password credentials with IDs `qa-login` and `uat-login`, or update the IDs in the Jenkinsfile.
2. Replace the example QA and UAT URLs.
3. Update `playwright.config.ts` and `global.setup.ts` to read `BASE_URL`, `TEST_USERNAME` and `TEST_PASSWORD` supplied by Jenkins.
4. Adapt page locators and tests to the target application.
5. Configure a suitable Jenkins agent with Node.js and Playwright browsers.

The current Sauce Demo configuration uses its public demo URL and credentials; it does not automatically use the Jenkins environment variables.

## Shared account and parallel tests

Global setup uses one account for authenticated tests. This is suitable when tests do not interfere with each other's server-side data. If parallel tests change shared account data, consider a separate account and saved state per worker. Reset or isolate data between tests, including application-wide shared records.

