import { type Page, type Locator } from '@playwright/test';

/**
 * NavbarComponent — Encapsulates header navigation in TokoQA.
 */
export class NavbarComponent {
  readonly root: Locator;
  readonly brandLogo: Locator;
  readonly cartLink: Locator;
  readonly cartCountBadge: Locator;
  readonly ordersLink: Locator;
  readonly userMenuButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('#app-header');
    this.brandLogo = this.root.getByRole('link', { name: /TokoQA/i });
    this.cartLink = this.root.getByTestId('cart-link');
    this.cartCountBadge = this.root.getByTestId('cart-count');
    this.ordersLink = this.root.getByRole('link', { name: /Pesanan/i });
    this.userMenuButton = this.root.locator('.user-trigger');
  }

  /**
   * Get item count shown on the cart badge in header.
   */
  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartCountBadge.textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  /**
   * Navigate to Cart page via header icon.
   */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
