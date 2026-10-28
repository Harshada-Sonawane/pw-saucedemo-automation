import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');

    this.continueButton = page.getByRole('button', {
      name: 'Continue',
    });

    this.finishButton = page.getByRole('button', {
      name: 'Finish',
    });

    this.confirmationMessage = page.getByRole('heading', {
      name: 'Thank you for your order!',
    });
  }

  async enterCustomerDetails(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  product(productName: string): Locator {
    return this.page
      .locator('.cart_item')
      .getByText(productName, { exact: true });
  }
}