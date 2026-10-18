import { type Page, type Locator } from '@playwright/test';

/**
 * BasePage — Abstract base class for all Page Objects in TokoQA.
 */
export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly path: string = '/',
  ) {}

  /**
   * Navigate to the page path using baseURL.
   */
  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  /**
   * Navigate to an explicit URL.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get current URL of the page.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get current page title.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for specific load state.
   */
  async waitForLoad(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'load',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Wait for URL to match pattern.
   */
  async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  /**
   * Take screenshot for debugging/artifact.
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
