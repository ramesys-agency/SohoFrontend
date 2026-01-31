import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image, View } from "react-native";

// Screens
import HomeScreen from "../screens/user/home/index";
import ProductDetailScreen from "../screens/user/home/product-detail";
import ProductListScreen from "../screens/user/home/product-list";

import CatalogScreen from "../screens/user/catalog/index";
import CatalogProductDetailScreen from "../screens/user/catalog/product-detail";

import WardrobeScreen from "../screens/user/wardrobe/index"; // Check if this has details

import WishlistScreen from "../screens/user/wishlist/index";

import ProfileScreen from "../screens/user/profile/index";
import OrdersScreen from "../screens/user/profile/orders";
import SettingsScreen from "../screens/user/profile/settings";

import AddressScreen from "../screens/user/wardrobe/address";
import OrderSuccessScreen from "../screens/user/wardrobe/order-success";
import PaymentScreen from "../screens/user/wardrobe/payment";

// Stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeIndex" component={HomeScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

function CatalogStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CatalogIndex" component={CatalogScreen} />
      <Stack.Screen
        name="CatalogProductDetail"
        component={CatalogProductDetailScreen}
      />
    </Stack.Navigator>
  );
}

function WardrobeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WardrobeIndex" component={WardrobeScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
}

function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WishlistIndex" component={WishlistScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileIndex" component={ProfileScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
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
          height: 100,
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
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
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
      <Tab.Screen
        name="Catalog"
        component={CatalogStack}
        options={{
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
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeStack}
        options={{
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
      <Tab.Screen
        name="Wishlist"
        component={WishlistStack}
        options={{
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
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={`w-8 h-8 rounded-full overflow-hidden border border-transparent ${
                focused ? "border-black" : ""
              }`}
            >
              <Image
                source={{
                  uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                }}
                className="w-full h-full"
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="MainTabs" component={MainTabs} />
    </Drawer.Navigator>
  );
}
