import { type APIRequestContext, type APIResponse } from '@playwright/test';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  totalQty: number;
  total: number;
}

/**
 * CartApi — Helper for TokoQA Shopping Cart API
 */
export class CartApi {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Get current cart contents.
   */
  async getCart(token?: string): Promise<{ status: number; data: CartResponse | null; response: APIResponse }> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await this.request.get('/api/cart', { headers });
    const status = response.status();
    const data = response.ok() ? ((await response.json()) as CartResponse) : null;

    return { status, data, response };
  }

  /**
   * Add item to cart.
   */
  async addItem(
    productId: number,
    qty: number,
    token?: string,
  ): Promise<{ status: number; body: any; response: APIResponse }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await this.request.post('/api/cart', {
      headers,
      data: { productId, qty },
    });

    const status = response.status();
    const body = await response.json().catch(() => ({}));

    return { status, body, response };
  }

  /**
   * Remove item from cart.
   */
  async removeItem(
    productId: number,
    token?: string,
  ): Promise<{ status: number; response: APIResponse }> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await this.request.delete(`/api/cart/${productId}`, { headers });
    return { status: response.status(), response };
  }
}
