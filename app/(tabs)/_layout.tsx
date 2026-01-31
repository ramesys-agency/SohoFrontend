import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 115,
          paddingBottom: 20,
          paddingTop: 10,
          position: "absolute",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="house.fill"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="square.grid.2x2.fill"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: "Wardrobe",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="cart.fill"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="heart.fill"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.profileImageContainer,
                focused && styles.profileImageFocused,
              ]}
            >
              <Image
                source={{
                  uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                }}
                style={styles.profileImage}
              />
            </View>
          ),
          tabBarLabel: () => null, // Design doesn't seem to have label for profile in some cases, but the image shows it might have one or just be clean. Looking at the image, there is NO label for profile.
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "transparent",
  },
  profileImageFocused: {
    borderColor: "#000",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
});
