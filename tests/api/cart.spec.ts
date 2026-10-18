import { test, expect } from '@playwright/test';
import { AuthApi } from '@helpers/api/auth.api';
import { CartApi } from '@helpers/api/cart.api';

test.describe('TokoQA API Cart Suite', () => {
  let authApi: AuthApi;
  let cartApi: CartApi;
  let token: string;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
    cartApi = new CartApi(request);

    const user = process.env.CUSTOMER_USER;
    const pass = process.env.CUSTOMER_PASS;

    if (!user || !pass) throw new Error('Please set CUSTOMER_USER and CUSTOMER_PASS in .env');

    const authData = await authApi.login(user, pass);
    token = authData.token;
  });

  test('akses keranjang tanpa token mengembalikan 401', { tag: '@regression' }, async () => {
    const { status } = await cartApi.getCart(); // No token provided
    expect(status).toBe(401);
  });

  test('tambah item ke keranjang berhasil dengan token', { tag: '@smoke' }, async () => {
    // Tambah Keyboard Mekanik (id: 1, qty: 1)
    const { status, body } = await cartApi.addItem(1, 1, token);
    expect([200, 201]).toContain(status);
    expect(body.items).toBeDefined();
    expect(body.totalQty).toBeGreaterThanOrEqual(1);
  });

  test('tambah item melebihi stok mengembalikan 409 Conflict', { tag: '@regression' }, async () => {
    // Tas Laptop (id: 3, stock: 0)
    const { status, body } = await cartApi.addItem(3, 9999, token);
    expect(status).toBe(409);
    expect(body.error).toMatch(/Stok .* tidak cukup/i);
  });
});
