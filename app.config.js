export default {
  expo: {
    name: "Soho",
    slug: "SohoApplication",
    version: "1.0.0",
    orientation: "portrait",
    // App Store requires 1024x1024, square, opaque, no alpha channel.
    icon: "./assets/images/Soho1024x1024.png",
    scheme: "sohoapplication",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.sohobd.app",
      googleServicesFile: "./GoogleService-Info.plist",
      // buildNumber is managed remotely by EAS (eas.json -> cli.appVersionSource)
      config: {
        // App only uses standard HTTPS/TLS — exempt from export compliance.
        // Without this, App Store Connect asks for a manual declaration on every upload.
        usesNonExemptEncryption: false,
      },
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
          // Android draws this as a silhouette, so it needs the transparent
          // wordmark, not the opaque square app icon (that renders as a
          // solid white block in the status bar). iOS ignores it entirely.
          icon: "./assets/images/soho.png",
          color: "#FFFFFF",
          defaultChannel: "default",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Soho uses your photo library so you can choose a picture for your profile.",
          // The app never opens the camera or records audio — keep these
          // permissions out of the binary so App Review doesn't ask why.
          cameraPermission: false,
          microphonePermission: false,
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/soho.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          // No dark variant: the app is locked to userInterfaceStyle "light",
          // and prebuild warns that the two settings conflict.
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
