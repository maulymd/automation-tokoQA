import { test, expect } from '@fixtures/index';
import { CartApi } from '@helpers/api/cart.api';

test.describe('TokoQA Hybrid Automation Suite', () => {
  test('bypass login dan siapkan data via API untuk fast checkout', { tag: '@regression' }, async ({
    page,
    authApi,
    checkoutPage,
  }) => {
    // 1. API Setup: Login dan dapatkan token JWT
    const user = process.env.CUSTOMER_USER;
    const pass = process.env.CUSTOMER_PASS;

    if (!user || !pass) throw new Error('Please set CUSTOMER_USER and CUSTOMER_PASS in .env');

    const authData = await authApi.login(user, pass);
    const token = authData.token;

    // 2. API Setup: Masukkan barang ke keranjang lewat API (Mouse Wireless id: 2)
    const cartApi = new CartApi(page.request);
    const cartAdd = await cartApi.addItem(2, 1, token);
    expect([200, 201]).toContain(cartAdd.status);

    // 3. Hybrid Injection: Set token ke localStorage browser
    await page.goto('/login-toko.html');
    await page.evaluate((jwt) => {
      window.localStorage.setItem('tokoqa_token', jwt);
    }, token);

    // 4. UI Direct Navigation: Buka halaman checkout langsung
    await checkoutPage.open();
    await checkoutPage.waitForLoad('domcontentloaded');

    // 5. Selesaikan checkout via UI
    await checkoutPage.fillAddress(
      'Ahmad Syarif',
      '081987654321',
      'Jl. Sudirman No. 45',
      'Bandung',
      '40115',
    );
    await checkoutPage.continueToShipping();

    await checkoutPage.chooseShipping('Reguler');
    await checkoutPage.continueToPayment();

    await checkoutPage.payWith('Transfer');
    await checkoutPage.agreeTerms();
    await checkoutPage.submit();

    // 6. Verifikasi konfirmasi pesanan berhasil
    await expect(checkoutPage.successHeading).toBeVisible();
    await expect(checkoutPage.orderId).toHaveText(/^TQA-\d+$/);
    await expect(checkoutPage.orderTotal).toHaveText('Rp 185.000');
  });
});
