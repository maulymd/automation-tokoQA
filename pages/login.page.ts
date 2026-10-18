import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage — Page Object for TokoQA login (/login-toko.html)
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page, '/login-toko.html');

    this.pageHeading = page.getByRole('heading', { name: /Masuk ke TokoQA/i });
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByRole('alert');
  }

  /**
   * Perform user login.
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Get error alert message text if visible.
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
