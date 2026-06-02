import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export type NotificationType = "order" | "sale" | "update" | "general";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: async (
    filter: "all" | "read" | "unread" = "all",
  ): Promise<{ data: AppNotification[] }> => {
    const response = await apiClient.get(API_ROUTES.NOTIFICATIONS.BASE, {
      params: { filter },
    });
    return response.data;
  },
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get(
      API_ROUTES.NOTIFICATIONS.UNREAD_COUNT,
    );
    return response.data?.data?.count ?? 0;
  },
  markAsRead: async (id: string) => {
    const response = await apiClient.patch(
      API_ROUTES.NOTIFICATIONS.MARK_READ(id),
    );
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await apiClient.patch(API_ROUTES.NOTIFICATIONS.READ_ALL);
    return response.data;
  },
};
