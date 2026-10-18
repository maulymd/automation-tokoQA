import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { NavbarComponent } from './components/navbar.component';

/**
 * ShopPage — Page Object for TokoQA catalog and shop page (/shop.html)
 */
export class ShopPage extends BasePage {
  readonly navbar: NavbarComponent;
  readonly productCards: Locator;
  readonly categorySelect: Locator;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly cartAside: Locator;
  readonly cartItems: Locator;
  readonly cartCount: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page, '/shop.html');

    this.navbar = new NavbarComponent(page);
    this.productCards = page.getByTestId('product-card');
    this.categorySelect = page.locator('#category');
    this.searchInput = page.locator('#search');
    this.sortSelect = page.locator('#sort');
    this.cartAside = page.locator('#cart');
    this.cartItems = page.locator('#cart-items [data-testid="cart-item"]');
    this.cartCount = page.getByTestId('cart-count');
    this.cartTotal = page.getByTestId('cart-total');
    this.checkoutButton = page.locator('#checkout-btn');
  }

  /**
   * Filter products by category name.
   */
  async filterCategory(categoryName: string): Promise<void> {
    await this.categorySelect.selectOption({ label: categoryName });
  }

  /**
   * Search products by keyword.
   */
  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
  }

  /**
   * Get product card locator by product name.
   */
  product(productName: string): Locator {
    return this.productCards.filter({
      has: this.page.getByRole('heading', { name: productName }),
    });
  }

  /**
   * Add a specific product to the cart by its name.
   */
  async addToCart(productName: string): Promise<void> {
    const card = this.product(productName);
    const addButton = card.getByRole('button', { name: /tambah ke keranjang/i });
    await addButton.click();
  }

  /**
   * Remove an item from the cart sidebar by product name.
   */
  async removeFromCart(productName: string): Promise<void> {
    const removeBtn = this.cartAside.getByRole('button', {
      name: new RegExp(`Hapus ${productName}`, 'i'),
    });
    await removeBtn.click();
  }

  /**
   * Proceed to checkout from the cart sidebar.
   */
  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
