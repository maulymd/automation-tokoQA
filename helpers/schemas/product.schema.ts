import { z } from 'zod';

/**
 * Zod Schema for Single Product Contract
 */
export const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  emoji: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
});

/**
 * Zod Schema for GET /api/products response
 */
export const ProductsResponseSchema = z.object({
  data: z.array(ProductSchema).min(1),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
