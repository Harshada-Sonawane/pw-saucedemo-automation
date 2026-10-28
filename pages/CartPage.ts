import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', {
      name: 'Checkout',
    });
  }

  product(productName: string): Locator {
    return this.page
      .locator('.cart_item')
      .getByText(productName, { exact: true });
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}