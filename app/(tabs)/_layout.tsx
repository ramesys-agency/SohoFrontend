import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuthStore } from "@/store/authStore";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function TabsLayout() {
  const { user } = useAuthStore();

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
          fontFamily: "Urbanist-Medium",
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 90,
          paddingBottom: 25,
          paddingTop: 10,
          position: "absolute",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingHorizontal: 10,
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
              size={24}
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
              size={24}
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
              size={24}
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
              size={24}
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
          title: "Profile",
          tabBarIcon: ({ color, focused }) => {
            if (user?.avatar) {
              return (
                <View
                  className={`w-7 h-7 rounded-full overflow-hidden border ${
                    focused ? "border-black" : "border-transparent"
                  }`}
                >
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-full h-full"
                  />
                </View>
              );
            }
            return (
              <IconSymbol
                size={24}
                name="person.fill"
                color={color}
                focused={focused}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
