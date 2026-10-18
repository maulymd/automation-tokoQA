import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { ShopPage } from '@pages/shop.page';
import { CheckoutPage } from '@pages/checkout.page';
import { AdminPage } from '@pages/admin.page';
import { AuthApi } from '@helpers/api/auth.api';

/**
 * Fixture options interface
 */
export type TokoQAFixtures = {
  loginPage: LoginPage;
  shopPage: ShopPage;
  checkoutPage: CheckoutPage;
  adminPage: AdminPage;
  authApi: AuthApi;
  loggedInShop: ShopPage;
};

/**
 * Custom Playwright test runner with injected POM fixtures.
 */
export const test = base.extend<TokoQAFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },

  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },

  /**
   * Hybrid authenticated fixture:
   * Logs in via API, injects token into localStorage, navigates to /shop.html.
   * This provides fast, isolated, and reliable test setup.
   */
  loggedInShop: async ({ page, shopPage, authApi }, use) => {
    const user = process.env.CUSTOMER_USER || 'customer';
    const pass = process.env.CUSTOMER_PASS || 'rahasia123';

    // 1. Get token from API
    const authData = await authApi.login(user, pass);

    // 2. Navigate to base domain first so localStorage can be set for this origin
    await page.goto('/login-toko.html');
    await page.evaluate((token) => {
      window.localStorage.setItem('tokoqa_token', token);
    }, authData.token);

    // 3. Open shop page
    await shopPage.open();
    await shopPage.waitForLoad('domcontentloaded');

    await use(shopPage);
  },
});

export { expect };
