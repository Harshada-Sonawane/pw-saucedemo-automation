import { test, expect } from '../fixtures/pageFixtures';

test('user can purchase a product', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  const productName = 'Sauce Labs Backpack';

  // 1. Open products and add the backpack.
  await inventoryPage.open();

  await expect(inventoryPage.productCard(productName)).toBeVisible();

  await inventoryPage.addProductToCart(productName);

  await expect(inventoryPage.cartBadge).toHaveText('1');

  // 2. Open cart and check the selected product.
  await inventoryPage.openCart();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(cartPage.product(productName)).toBeVisible();

  // 3. Enter checkout details.
  await cartPage.startCheckout();

  await expect(page).toHaveURL(/checkout-step-one\.html/);

  await checkoutPage.enterCustomerDetails(
    'Harshada',
    'Sonawane',
    '411001'
  );

  await checkoutPage.continue();

  // 4. Check the overview and complete the order.
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(checkoutPage.product(productName)).toBeVisible();

  await checkoutPage.finishOrder();

  // 5. Verify the confirmation.
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkoutPage.confirmationMessage).toBeVisible();
});