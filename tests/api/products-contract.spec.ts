import { test, expect } from '@playwright/test';
import { ProductsResponseSchema } from '@helpers/schemas/product.schema';

test.describe('TokoQA API Products Contract Suite', () => {
  test('kontrak API produk sesuai spesifikasi skema Zod', { tag: '@smoke' }, async ({
    request,
  }) => {
    // 1. Panggil endpoint produk nyata
    const response = await request.get('/api/products');
    expect(response.status()).toBe(200);

    const json = await response.json();

    // 2. Validasi response terhadap Zod Contract Schema
    const parseResult = ProductsResponseSchema.safeParse(json);

    if (!parseResult.success) {
      console.error('Contract Validation Errors:', parseResult.error.format());
    }

    // 3. Assert bahwa validasi kontrak berhasil tanpa error
    expect(parseResult.success).toBe(true);

    // 4. Verifikasi bahwa ada minimal 5 produk terdaftar
    if (parseResult.success) {
      expect(parseResult.data.data.length).toBeGreaterThanOrEqual(5);
    }
  });
});
