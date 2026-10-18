import { test, expect } from '@fixtures/index';
import negativeCases from '@data/login-negative.json';

test.describe('TokoQA Login Negative Suite (Data-Driven)', () => {
  for (const item of negativeCases) {
    test(`login gagal: ${item.name}`, { tag: '@regression' }, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(item.username, item.password);

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(item.expectedError);
    });
  }
});
