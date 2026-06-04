export default {
  expo: {
    name: "SohoApplication",
    slug: "SohoApplication",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/soho.png",
    scheme: "sohoapplication",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sohobd.app",
      googleServicesFile: "./GoogleService-Info.plist",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
        foregroundImage: "./assets/images/adaptive-icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.sohobd.app",
      usesCleartextTraffic: true,
      googleServicesFile: "./google-services.json",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/images/soho.png",
          color: "#FFFFFF",
          defaultChannel: "default",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow Soho to access your photos to update your profile picture.",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/soho.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: `com.googleusercontent.apps.${process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.split(".apps.googleusercontent.com")[0]}`,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "b48b075e-995e-423c-aebb-bb92542259c9",
      },
    },
    owner: "arshad.code",
  },
};
