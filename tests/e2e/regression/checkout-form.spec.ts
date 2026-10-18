import { test, expect } from '@fixtures/index';
import checkoutCases from '@data/checkout-validation.json';

test.describe('TokoQA Checkout Form Validation (Data-Driven)', () => {
  for (const item of checkoutCases) {
    test(`validasi: ${item.scenario}`, { tag: '@regression' }, async ({
      loggedInShop: shop,
      checkoutPage,
    }) => {
      // 1. Add item to cart to enable checkout
      await shop.addToCart('Mouse Wireless');
      await shop.goToCheckout();
      await checkoutPage.waitForLoad('domcontentloaded');

      // 2. Fill address form with scenario data
      await checkoutPage.fillAddress(
        item.recipient,
        item.phone,
        item.street,
        item.city,
        item.postal,
      );
      await checkoutPage.continueToShipping();

      // 3. Assert validation alert
      await expect(checkoutPage.addressErrorAlert).toBeVisible();
      await expect(checkoutPage.addressErrorAlert).toHaveText(item.expectedError);
    });
  }
});
