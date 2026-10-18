import { type APIRequestContext } from '@playwright/test';
import { type ProductsResponse } from '@helpers/schemas/product.schema';

/**
 * ProductApi — Helper for TokoQA Products API
 */
export class ProductApi {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Fetch all products with optional query parameters.
   */
  async getProducts(params?: { q?: string; category?: string; sort?: string }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.sort) searchParams.set('sort', params.sort);

    const res = await this.request.get(`/api/products?${searchParams.toString()}`);
    if (!res.ok()) {
      throw new Error(`Failed to fetch products: status ${res.status()}`);
    }

    return (await res.json()) as ProductsResponse;
  }
}
