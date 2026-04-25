import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="register/verify" />
      <Stack.Screen name="register/details" />
      <Stack.Screen name="forgot-password/index" />
      <Stack.Screen name="forgot-password/verify" />
      <Stack.Screen name="forgot-password/reset" />
    </Stack>
  );
}
