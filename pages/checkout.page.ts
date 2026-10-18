import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CheckoutPage — Page Object for TokoQA 3-step checkout (/checkout.html)
 */
export class CheckoutPage extends BasePage {
  // Step 1: Alamat Pengiriman
  readonly recipientInput: Locator;
  readonly phoneInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly postalInput: Locator;
  readonly continueToShippingBtn: Locator;
  readonly addressErrorAlert: Locator;

  // Step 2: Pengiriman
  readonly shippingRegulerRadio: Locator;
  readonly shippingExpressRadio: Locator;
  readonly continueToPaymentBtn: Locator;

  // Step 3: Pembayaran
  readonly paymentTransferRadio: Locator;
  readonly paymentEwalletRadio: Locator;
  readonly paymentCodRadio: Locator;
  readonly agreeCheckbox: Locator;
  readonly payNowBtn: Locator;
  readonly paymentErrorAlert: Locator;

  // Confirmation / Success
  readonly successHeading: Locator;
  readonly orderId: Locator;
  readonly orderTotal: Locator;
  readonly orderShipping: Locator;

  constructor(page: Page) {
    super(page, '/checkout.html');

    // Step 1 locators
    this.recipientInput = page.getByLabel('Nama penerima');
    this.phoneInput = page.getByLabel('Nomor HP');
    this.streetInput = page.getByLabel('Alamat jalan');
    this.cityInput = page.getByLabel('Kota');
    this.postalInput = page.getByLabel('Kode pos');
    this.continueToShippingBtn = page.getByRole('button', {
      name: /lanjut ke pengiriman/i,
    });
    this.addressErrorAlert = page.locator('#err-1');

    // Step 2 locators
    this.shippingRegulerRadio = page.locator('input[name="shipping"][value="reguler"]');
    this.shippingExpressRadio = page.locator('input[name="shipping"][value="express"]');
    this.continueToPaymentBtn = page.getByRole('button', {
      name: /lanjut ke pembayaran/i,
    });

    // Step 3 locators
    this.paymentTransferRadio = page.locator('input[name="payment"][value="transfer"]');
    this.paymentEwalletRadio = page.locator('input[name="payment"][value="ewallet"]');
    this.paymentCodRadio = page.locator('input[name="payment"][value="cod"]');
    this.agreeCheckbox = page.locator('#agree');
    this.payNowBtn = page.getByRole('button', { name: /bayar sekarang/i });
    this.paymentErrorAlert = page.locator('#err-3');

    // Success view locators
    this.successHeading = page.getByRole('heading', { name: /pesanan berhasil/i });
    this.orderId = page.getByTestId('order-id');
    this.orderTotal = page.getByTestId('order-total');
    this.orderShipping = page.locator('#order-shipping');
  }

  /**
   * Fill Step 1: Address form.
   */
  async fillAddress(
    recipient: string,
    phone: string,
    street: string,
    city: string,
    postal: string,
  ): Promise<void> {
    await this.recipientInput.fill(recipient);
    await this.phoneInput.fill(phone);
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.postalInput.fill(postal);
  }

  /**
   * Submit Step 1 and proceed to Step 2.
   */
  async continueToShipping(): Promise<void> {
    await this.continueToShippingBtn.click();
  }

  /**
   * Choose shipping option in Step 2 ('Reguler' or 'Express').
   */
  async chooseShipping(method: 'Reguler' | 'Express'): Promise<void> {
    if (method.toLowerCase() === 'express') {
      await this.shippingExpressRadio.check();
    } else {
      await this.shippingRegulerRadio.check();
    }
  }

  /**
   * Submit Step 2 and proceed to Step 3.
   */
  async continueToPayment(): Promise<void> {
    await this.continueToPaymentBtn.click();
  }

  /**
   * Select payment method in Step 3 ('Transfer' | 'E-Wallet' | 'COD').
   */
  async payWith(method: string): Promise<void> {
    const m = method.toLowerCase().replace(/[\s-]/g, '');
    if (m.includes('ewallet') || m.includes('wallet')) {
      await this.paymentEwalletRadio.check();
    } else if (m.includes('cod')) {
      await this.paymentCodRadio.check();
    } else {
      await this.paymentTransferRadio.check();
    }
  }

  /**
   * Check terms and conditions agreement checkbox.
   */
  async agreeTerms(): Promise<void> {
    await this.agreeCheckbox.check();
  }

  /**
   * Submit payment to finalize checkout.
   */
  async submit(): Promise<void> {
    await this.payNowBtn.click();
  }
}
