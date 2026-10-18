import { test, expect } from '@fixtures/index';

test.describe('TokoQA E2E Smoke Suite', () => {
  test('belanja end-to-end', { tag: '@smoke' }, async ({ loggedInShop: shop, checkoutPage }) => {
    // 1. Filter category
    await shop.filterCategory('Elektronik');
    await expect(shop.productCards).toHaveCount(4);

    // 2. Add products to cart
    await shop.addToCart('Keyboard Mekanik');
    await expect(shop.cartCount).toHaveText('1');
    await shop.addToCart('Mouse Wireless');
    await expect(shop.cartCount).toHaveText('2');
    await expect(shop.cartTotal).toHaveText('Rp 935.000');

    // 3. Go to checkout
    await shop.goToCheckout();
    await checkoutPage.waitForLoad('domcontentloaded');

    // Step 1: Address
    await checkoutPage.fillAddress(
      'Rina Wulandari',
      '081234567890',
      'Jl. Automation No. 1',
      'Jakarta',
      '10110',
    );
    await checkoutPage.continueToShipping();

    // Step 2: Shipping
    await checkoutPage.chooseShipping('Reguler');
    await checkoutPage.continueToPayment();

    // Step 3: Payment
    await checkoutPage.payWith('E-Wallet');
    await checkoutPage.agreeTerms();
    await checkoutPage.submit();

    // 4. Verification
    await expect(checkoutPage.successHeading).toBeVisible();
    await expect(checkoutPage.orderId).toHaveText(/^TQA-\d+$/);
    await expect(checkoutPage.orderTotal).toHaveText('Rp 935.000');
  });
});
