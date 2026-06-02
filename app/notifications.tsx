import { Feather } from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  notificationApi,
  type AppNotification,
} from "../api/notification.api";
import SubHeader from "./components/navbar/SubHeader";

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return date.toLocaleDateString();
}

function dateSection(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const time = date.getTime();
  if (time >= startOfToday) return "Today";
  if (time >= startOfToday - 86400000) return "Yesterday";
  return "Earlier";
}

function getIcon(type: string) {
  switch (type) {
    case "order":
      return <Feather name="shopping-bag" size={22} color="black" />;
    case "sale":
      return <Feather name="tag" size={22} color="black" />;
    case "update":
      return <Feather name="bell" size={22} color="black" />;
    default:
      return <Feather name="bell" size={22} color="black" />;
  }
}

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState(0); // 0 = Unread, 1 = Read
  const queryClient = useQueryClient();

  const filter = activeTab === 0 ? "unread" : "read";

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: () => notificationApi.getNotifications(filter),
  });

  const notifications: AppNotification[] = data?.data ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
  };

  const markRead = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: invalidate,
  });

  const handlePress = (item: AppNotification) => {
    if (!item.isRead) markRead.mutate(item.id);
    // Deep-link to the order if this notification references one.
    const orderId = (item.data as any)?.orderId;
    if (item.type === "order" && orderId) {
      router.push(`/profile/orders/${orderId}`);
    }
  };

  const sections = Array.from(
    new Set(notifications.map((n) => dateSection(n.createdAt))),
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Notifications"
        showBackButton
        hideNotification
        hideSearch
      />

      <View className="px-4 py-4 flex-row items-center gap-3">
        <View className="flex-1">
          <SegmentedControl
            values={["Unread", "Read"]}
            selectedIndex={activeTab}
            onChange={(event) => {
              setActiveTab(event.nativeEvent.selectedSegmentIndex);
            }}
            backgroundColor="#F3F3F3"
            tintColor="#000000"
            fontStyle={{
              fontFamily: "Urbanist-Medium",
              fontSize: 16,
              color: "#000000",
            }}
            activeFontStyle={{
              fontFamily: "Urbanist-Medium",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          />
        </View>
        {activeTab === 0 && notifications.length > 0 && (
          <TouchableOpacity
            onPress={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <Text
              className="text-sm text-black"
              style={{ fontFamily: "Urbanist-SemiBold" }}
            >
              {markAllRead.isPending ? "…" : "Mark all"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center px-4">
          <Feather name="cloud-off" size={48} color="#E5E5E5" />
          <Text
            className="mt-4 text-gray-400 text-lg"
            style={{ fontFamily: "Urbanist-Medium" }}
          >
            Failed to load notifications
          </Text>
          <TouchableOpacity
            className="mt-4 bg-black px-6 py-2 rounded-full"
            onPress={() => refetch()}
          >
            <Text
              className="text-white"
              style={{ fontFamily: "Urbanist-Bold" }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
            />
          }
        >
          {sections.length > 0 ? (
            sections.map((section) => (
              <View key={section} className="mb-6">
                <Text
                  className="text-xl mb-4"
                  style={{ fontFamily: "Urbanist-SemiBold" }}
                >
                  {section}
                </Text>
                {notifications
                  .filter((n) => dateSection(n.createdAt) === section)
                  .map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => handlePress(item)}
                      className={`p-4 rounded-xl flex-row items-start mb-4 ${
                        item.isRead ? "bg-[#F9F9F9]" : "bg-[#F1F1F1]"
                      }`}
                    >
                      <View className="w-12 h-12 items-center justify-center mr-3">
                        {getIcon(item.type)}
                      </View>
                      <View className="flex-1">
                        <View className="flex-row justify-between items-center mb-1">
                          <View className="flex-row items-center flex-1 mr-2">
                            {!item.isRead && (
                              <View className="w-2 h-2 rounded-full bg-black mr-2" />
                            )}
                            <Text
                              className="text-lg flex-1"
                              style={{ fontFamily: "Urbanist-Bold" }}
                            >
                              {item.title}
                            </Text>
                          </View>
                          <Text
                            className="text-gray-400 text-sm"
                            style={{ fontFamily: "Urbanist" }}
                          >
                            {timeAgo(item.createdAt)}
                          </Text>
                        </View>
                        <Text
                          className="text-gray-500 leading-5"
                          style={{ fontFamily: "Urbanist" }}
                        >
                          {item.body}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-20">
              <Feather name="bell-off" size={64} color="#E5E5E5" />
              <Text
                className="mt-4 text-xl text-gray-400"
                style={{ fontFamily: "Urbanist-Medium" }}
              >
                No notifications found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
