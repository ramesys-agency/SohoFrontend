import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const productApi = {
  getProducts: async (params?: Record<string, any>) => {
    const response = await apiClient.get(API_ROUTES.PRODUCT.GET_PRODUCTS, {
      params,
    });
    return response.data.data || response.data;
  },

  getProductById: async (id: string) => {
    const response = await apiClient.get(API_ROUTES.PRODUCTS.DETAILS(id));
    return response.data.data || response.data;
  },

  searchProducts: async (
    params: SearchParams,
    options?: { signal?: AbortSignal },
  ): Promise<SearchResponse> => {
    const response = await apiClient.get(API_ROUTES.PRODUCTS.SEARCH, {
      params,
      ...(options?.signal ? { signal: options.signal } : {}),
    });
    return response.data.data || response.data;
  },
};

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Comma-separated when more than one is picked. */
  size?: string;
  color?: string;
  inStock?: boolean;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "rating" | "popularity";
}

/** What the filter sheet offers, built from everything the query matched. */
export interface SearchFacets {
  categories: { id: string; name: string; slug: string; count: number }[];
  colors: { colorName: string; colorValue: string; count: number }[];
  sizes: { size: string; count: number }[];
  genders: { gender: string; count: number }[];
  priceRange: { min: number; max: number } | null;
}

export interface SearchProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  primaryImage?: string;
  variantId?: string;
  isWishlisted?: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  availableColors?: { colorName: string; colorValue: string }[];
  category?: { id: string; name: string; slug: string };
}

export interface SearchResponse {
  success: boolean;
  query: string;
  /** True when nothing matched every word and the search was widened. */
  widened?: boolean;
  count: number;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  facets: SearchFacets;
  products: SearchProduct[];
}
