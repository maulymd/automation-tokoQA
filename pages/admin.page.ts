import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * AdminPage — Page Object for TokoQA Admin Dashboard (/admin.html)
 */
export class AdminPage extends BasePage {
  readonly deniedHeading: Locator;
  readonly dashboardHeading: Locator;
  readonly lowStockBadge: Locator;
  readonly totalOrdersBadge: Locator;
  readonly pendingBadge: Locator;
  readonly revenueBadge: Locator;
  readonly refreshButton: Locator;

  // Tabs
  readonly ordersTab: Locator;
  readonly productsTab: Locator;
  readonly couponsTab: Locator;

  constructor(page: Page) {
    super(page, '/admin.html');

    this.deniedHeading = page.getByRole('heading', { name: 'Akses ditolak' });
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard admin' });
    this.lowStockBadge = page.getByTestId('admin-low-stock');
    this.totalOrdersBadge = page.getByTestId('admin-total-orders');
    this.pendingBadge = page.getByTestId('admin-pending');
    this.revenueBadge = page.getByTestId('admin-revenue');
    this.refreshButton = page.locator('#refresh');

    this.ordersTab = page.locator('#tab-pesanan');
    this.productsTab = page.locator('#tab-produk');
    this.couponsTab = page.locator('#tab-kupon');
  }

  /**
   * Switch to products tab.
   */
  async openProductsTab(): Promise<void> {
    await this.productsTab.click();
  }

  /**
   * Switch to coupons tab.
   */
  async openCouponsTab(): Promise<void> {
    await this.couponsTab.click();
  }
}
