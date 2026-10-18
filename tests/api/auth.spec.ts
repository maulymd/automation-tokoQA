import { test, expect } from '@playwright/test';
import { AuthApi } from '@helpers/api/auth.api';

test.describe('TokoQA API Auth Suite', () => {
  let authApi: AuthApi;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
  });

  test('login API berhasil mengembalikan token JWT dan data user', { tag: '@smoke' }, async () => {
    const user = process.env.CUSTOMER_USER;
    const pass = process.env.CUSTOMER_PASS;

    if (!user || !pass) throw new Error('Please set CUSTOMER_USER and CUSTOMER_PASS in .env');

    const result = await authApi.login(user, pass);

    expect(result.token).toBeDefined();
    expect(result.token.split('.')).toHaveLength(3); // Valid JWT structure
    expect(result.user.username).toBe(user);
    expect(result.user.role).toBe('customer');
  });

  test('login API gagal dengan password salah mengembalikan 401', { tag: '@regression' }, async ({
    request,
  }) => {
    const response = await request.post('/api/login', {
      data: { username: 'customer', password: 'wrongpassword' },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Username atau password salah');
  });

  test('login API akun terkunci ditolak', { tag: '@regression' }, async ({ request }) => {
    const response = await request.post('/api/login', {
      data: { username: 'terkunci', password: 'rahasia123' },
    });

    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toBe('Akun kamu terkunci. Hubungi admin.');
  });
});
