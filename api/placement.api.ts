import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export type PlacementPage = "HOME" | "MEN" | "WOMEN" | "KIDS" | "OFFERS";

export type PlacementSection =
  | "HERO"
  | "FEATURED_ROW"
  | "GRID_SECTION"
  | "MID_BANNER"
  | "SEE_ALL"
  /** The round category shortcuts along the top of a catalog tab. */
  | "CATEGORY_CIRCLE";

/**
 * One page+section slot. Every placement carries its own name, link handle,
 * cover image and product list — two sections built from the same source are
 * separate entities, so the app can label each one correctly.
 */
export interface Placement {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  description: string | null;
  /** When set, tapping the section opens this product instead of a list. */
  productId: string | null;
  imageUrl: string | null;
  isBanner: boolean;
  /**
   * Set when the placement's products are derived from a category rather than
   * hand-picked: the category's own products, plus or minus whatever the admin
   * changed. Tapping it still opens the placement, not the raw category.
   */
  sourceCategoryId: string | null;
  page: PlacementPage;
  section: PlacementSection;
  displayOrder: number;
  isActive: boolean;
  gender: string[];
  productCount: number;
  /** First two product images — the collage layout draws these. */
  previewImages: string[];
  createdAt: string;
}

export const placementApi = {
  getPlacements: async (
    page: PlacementPage,
    section?: PlacementSection,
  ): Promise<Placement[]> => {
    const response = await apiClient.get(API_ROUTES.PLACEMENT.GET_PLACEMENTS, {
      params: { page, isActive: true, ...(section ? { section } : {}) },
    });
    const data: Placement[] = response.data?.data ?? [];
    return [...data].sort((a, b) => a.displayOrder - b.displayOrder);
  },
};
