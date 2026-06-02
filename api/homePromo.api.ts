import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export interface HeroSlide {
  placementId: string;
  imageUrl: string;
  collectionId: string;
  collectionName: string;
  collectionSlug: string;
}

export const homePromoApi = {
  getSection: async () => {
    const response = await apiClient.get(API_ROUTES.HOME_PROMO.GET);
    return response.data;
  },

  getHeroSlides: async (): Promise<HeroSlide[]> => {
    const response = await apiClient.get(API_ROUTES.COLLECTION.GET_COLLECTIONS, {
      params: {
        placementPage: "HOME",
        placementSection: "HERO",
        placementIsActive: "true",
        limit: 10,
      },
    });
    const collections: any[] = response.data?.data ?? [];
    return collections.flatMap((col: any) =>
      (col.collectionPlacements ?? []).map((p: any) => ({
        placementId: p.id,
        imageUrl: p.imageUrl ?? "",
        collectionId: col.id,
        collectionName: col.name,
        collectionSlug: col.slug,
      }))
    );
  },
};
