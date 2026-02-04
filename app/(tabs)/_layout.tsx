import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
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
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
      }}
    >
      {/* Home */}
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

      {/* Catalog */}
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

      {/* Wardrobe */}
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

      {/* Wishlist */}
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

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              className={`w-8 h-8 rounded-full overflow-hidden border ${
                focused ? "border-black" : "border-transparent"
              }`}
            >
              <Image
                source={{
                  uri: "https://i.pravatar.cc/150?u=soho-user",
                }}
                className="w-full h-full"
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
