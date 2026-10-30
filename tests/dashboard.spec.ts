import { test, expect } from '../fixtures/pageFixtures';
import { products } from '../test-data/testData';

test.describe('Products page', () => {
  test('logged-in user can see products', async ({ inventoryPage }) => {
    await inventoryPage.open();

    await expect(inventoryPage.productsHeading).toBeVisible();
  });

  test('user can add and remove a product from the cart', async ({
    inventoryPage,
  }) => {
    const productName = products.backpack;

    await inventoryPage.open();

    // Add the product and verify the cart count.
    await inventoryPage.addProductToCart(productName);

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(
      inventoryPage.productCard(productName)
        .getByRole('button', { name: 'Remove' })
    ).toBeVisible();

    // Remove it and verify the cart is empty.
    await inventoryPage.removeProductFromCart(productName);

    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await expect(
      inventoryPage.productCard(productName)
        .getByRole('button', { name: 'Add to cart' })
    ).toBeVisible();
  });

  test('user can sort products by price from low to high', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open();
    await inventoryPage.sortByPriceLowToHigh();

    const prices = await inventoryPage.getProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices.length).toBeGreaterThan(0);
    expect(prices).toEqual(sortedPrices);
  });
});