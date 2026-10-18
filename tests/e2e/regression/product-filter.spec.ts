import { test, expect } from '@fixtures/index';

test.describe('TokoQA Product Catalog & Stock Suite', () => {
  test('cari dan filter produk', { tag: '@regression' }, async ({ loggedInShop: shop }) => {
    await shop.filterCategory('Elektronik');
    await expect(shop.productCards).toHaveCount(4);

    await shop.searchProduct('Keyboard');
    await expect(shop.productCards).toHaveCount(1);
    await expect(shop.product('Keyboard Mekanik')).toBeVisible();
  });

  test('produk stok habis tidak bisa dibeli', { tag: '@regression' }, async ({ loggedInShop: shop }) => {
    const tombol = shop.product('Tas Laptop').getByRole('button', { name: 'Tambah ke keranjang' });
    await expect(tombol).toBeDisabled();
  });
});
