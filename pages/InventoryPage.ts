import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly productsHeading: Locator;
  readonly sortDropdown: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');

    this.productsHeading = page.getByText('Products', { exact: true });
    this.sortDropdown = page.locator('.product_sort_container');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async open() {
    await this.page.goto('/inventory.html');
  }

  productCard(productName: string): Locator {
    return this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });
  }

  async addProductToCart(productName: string) {
    await this.productCard(productName)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  // New method: remove a product from the inventory page.
  async removeProductFromCart(productName: string) {
    await this.productCard(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  // New method: choose low-to-high price sorting.
  async sortByPriceLowToHigh() {
    await this.sortDropdown.selectOption('lohi');
  }

  // New method: return displayed prices as numbers.
  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allTextContents();

    return priceTexts.map(price => Number(price.replace('$', '')));
  }
}