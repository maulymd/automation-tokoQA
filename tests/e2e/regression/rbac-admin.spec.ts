import { test, expect } from '@fixtures/index';

test.describe('TokoQA Role-Based Access Control Suite', () => {
  test('dashboard admin hanya untuk admin', { tag: '@regression' }, async ({
    loggedInShop,
    loginPage,
    adminPage,
    page,
  }) => {
    // 1. Customer (from loggedInShop fixture) is denied on admin page
    await page.goto('/admin.html');
    await expect(adminPage.deniedHeading).toBeVisible();

    // 2. Admin is redirected to admin dashboard after login
    await loginPage.open();
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';
    await loginPage.login(adminUser, adminPass);

    await expect(page).toHaveURL(/admin\.html$/);
    await expect(adminPage.dashboardHeading).toBeVisible();
    await expect(adminPage.lowStockBadge).toContainText('Tas Laptop (0)');
  });
});
