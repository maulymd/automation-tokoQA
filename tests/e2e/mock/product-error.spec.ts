import { test, expect } from '@fixtures/index';

test.describe('TokoQA Network Mocking Suite', () => {
  test('tampilan saat API produk error 500 menampilkan error state ramah pengguna', {
    tag: '@regression',
  }, async ({ page, shopPage, authApi }) => {
    // 1. Setup session customer
    const user = process.env.CUSTOMER_USER;
    const pass = process.env.CUSTOMER_PASS;
    
    if (!user || !pass) throw new Error('Please set CUSTOMER_USER and CUSTOMER_PASS in .env');

    const authData = await authApi.login(user, pass);

    await page.goto('/login-toko.html');
    await page.evaluate((jwt) => {
      window.localStorage.setItem('tokoqa_token', jwt);
    }, authData.token);

    // 2. Intercept dan mock endpoint /api/products untuk return status 500
    await page.route('**/api/products*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Terjadi gangguan pada server produk' }),
      });
    });

    // 3. Buka halaman katalog produk
    await shopPage.open();

    // 4. Verifikasi bahwa UI menampilkan pesan error state (bukan crash / halaman kosong)
    const errorState = page.locator('.state.error[data-state="error"]');
    await expect(errorState).toBeVisible();
    await expect(errorState).toContainText('Data gagal dimuat');
    await expect(errorState).toContainText('Terjadi gangguan pada server produk');

    // 5. Verifikasi tombol "Coba lagi" (retry) tersedia
    const retryButton = errorState.getByRole('button', { name: /coba lagi/i });
    await expect(retryButton).toBeVisible();

    // 6. Verifikasi tidak ada kartu produk yang tampil
    await expect(shopPage.productCards).toHaveCount(0);
  });
});
