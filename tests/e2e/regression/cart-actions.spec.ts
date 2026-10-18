import { test, expect } from '@fixtures/index';

test.describe('TokoQA Cart Actions Suite', () => {
  test('hapus item dari keranjang', { tag: '@regression' }, async ({ loggedInShop: shop }) => {
    await shop.addToCart('Lampu Meja LED');
    await expect(shop.cartItems).toHaveCount(1);

    await shop.removeFromCart('Lampu Meja LED');
    await expect(shop.cartItems).toHaveCount(0);
    await expect(shop.checkoutButton).toBeDisabled();
  });
});
