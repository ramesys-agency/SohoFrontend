import { Feather } from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "./components/navbar/SubHeader";

const notifications = [
  {
    id: "1",
    title: "Your order has been verified",
    body: 'We have succesfully verified your order for your "Playstation 5 Pro" purchase.',
    time: "1h ago",
    type: "order",
    isRead: false,
    dateSection: "Today",
  },
  {
    id: "2",
    title: "EID Fashion Sale Is Here!",
    body: "Summer fashion sale is here! Enjoy -50% OFF ALL PURCHASES!",
    time: "1h ago",
    type: "sale",
    isRead: false,
    dateSection: "Today",
  },
  {
    id: "3",
    title: "New Collection Launch",
    body: "Discover our latest summer collection now available in stores.",
    time: "1d ago",
    type: "update",
    isRead: true,
    dateSection: "Yesterday",
  },
];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState(0); // 0 for Unread, 1 for Read
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a reload
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredNotifications = notifications.filter((n) =>
    activeTab === 0 ? !n.isRead : n.isRead,
  );

  const sections = Array.from(
    new Set(filteredNotifications.map((n) => n.dateSection)),
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Feather name="check" size={24} color="black" />;
      case "sale":
        return <Feather name="shopping-bag" size={24} color="black" />;
      default:
        return <Feather name="bell" size={24} color="black" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Notifications"
        showBackButton
        hideNotification
        hideSearch
      />

      <View className="px-4 py-4">
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

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              {filteredNotifications
                .filter((n) => n.dateSection === section)
                .map((item) => (
                  <View
                    key={item.id}
                    className="bg-[#F9F9F9] p-4 rounded-xl flex-row items-start mb-4"
                  >
                    <View className="w-12 h-12 items-center justify-center mr-4">
                      {getIcon(item.type)}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text
                          className="text-lg flex-1 mr-2"
                          style={{ fontFamily: "Urbanist-Bold" }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          className="text-gray-400 text-sm"
                          style={{ fontFamily: "Urbanist" }}
                        >
                          {item.time}
                        </Text>
                      </View>
                      <Text
                        className="text-gray-500 leading-5"
                        style={{ fontFamily: "Urbanist" }}
                      >
                        {item.body}
                      </Text>
                    </View>
                  </View>
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
    </SafeAreaView>
  );
}
