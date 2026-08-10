import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

/** One line of a hold — a variant and the units held for this customer. */
export interface CheckoutHoldItem {
  variantId: string;
  quantity: number;
}

export interface CheckoutHold {
  /** Null when the server has stock reservations switched off. */
  checkoutId: string | null;
  enabled: boolean;
  expiresAt: string | null;
  ttlSeconds: number;
  items: CheckoutHoldItem[];
}

/** Returned inside a 409 so the screen can name the items that ran out. */
export interface CheckoutShortage {
  variantId: string;
  productName?: string;
  variantLabel?: string;
  requested: number;
  available: number;
}

/** Checkout pricing that the server, not the app, decides. */
export interface CheckoutConfig {
  /** Flat delivery charge added to every order, in `currency`. */
  deliveryFee: number;
  currency: string;
}

export const checkoutApi = {
  /**
   * The delivery fee is read from here rather than hardcoded: the server adds
   * it to the order total and it is what the courier collects, so a local copy
   * would eventually show the customer a price they aren't charged.
   */
  getConfig: async (): Promise<CheckoutConfig> => {
    const response = await apiClient.get(API_ROUTES.CHECKOUT.CONFIG);
    return response.data.data;
  },

  reserve: async (body?: {
    buyNow?: { variantId: string; quantity?: number };
  }): Promise<CheckoutHold> => {
    const response = await apiClient.post(API_ROUTES.CHECKOUT.RESERVE, body ?? {});
    return response.data.data;
  },

  renew: async (checkoutId: string): Promise<CheckoutHold> => {
    const response = await apiClient.post(API_ROUTES.CHECKOUT.RENEW(checkoutId));
    return response.data.data;
  },

  status: async (checkoutId: string) => {
    const response = await apiClient.get(API_ROUTES.CHECKOUT.STATUS(checkoutId));
    return response.data.data;
  },

  release: async (checkoutId: string) => {
    const response = await apiClient.delete(API_ROUTES.CHECKOUT.RELEASE(checkoutId));
    return response.data.data;
  },
};
