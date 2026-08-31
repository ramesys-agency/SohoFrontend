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
      bundleIdentifier: "com.sohobd.shop",
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
      package: "com.sohobd.shop",
      googleServicesFile: "./google-services.json",
      // Permissions pulled in by dependencies that this app never exercises.
      // They ship in the release manifest otherwise, and Play surfaces them on
      // the listing — "Display over other apps" in particular reads badly on a
      // shopping app and invites questions during review.
      //   SYSTEM_ALERT_WINDOW — expo-dev-client's debug overlay; dead weight in release.
      //   READ/WRITE_EXTERNAL_STORAGE — expo-image-picker's legacy (API <= 32) path.
      //     edit-profile.tsx calls launchImageLibraryAsync straight off, with no
      //     requestMediaLibraryPermissionsAsync, so it goes through the system
      //     photo picker and needs neither.
      blockedPermissions: [
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
      ],
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
          // Android draws this as a silhouette cut from the alpha channel, so
          // it needs the transparent wordmark rather than any of the
          // white-backed assets (those render as a solid white block in the
          // status bar). This is the only asset that keeps its transparency.
          // iOS ignores it entirely.
          icon: "./assets/images/notification-icon.png",
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
          // Android 12+ masks the splash icon to a 192dp circle (96dp radius).
          // The wordmark's widest points sit 0.506 * imageWidth from centre, so
          // anything over ~189 gets its left tip shaved off — 200 clipped 4dp.
          // 180 keeps it inside with ~5dp to spare. Keep app/index.tsx's <Logo>
          // at this same width so the native splash hands off without a jump.
          imageWidth: 180,
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
      // Facebook login is on hold. The plugin throws "missing appID in the
      // plugin properties" whenever EXPO_PUBLIC_FACEBOOK_APP_ID is blank, which
      // stops `expo start` before Metro boots. Fill in the Facebook App ID and
      // client token in .env, uncomment this block, then run
      // `npx expo prebuild --clean` to put the native config back.
      // [
      //   "react-native-fbsdk-next",
      //   {
      //     appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
      //     clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
      //     displayName: "Soho",
      //     // Facebook redirects back through this exact scheme; it must be the
      //     // literal string "fb" + the app ID or the login never returns.
      //     scheme: `fb${process.env.EXPO_PUBLIC_FACEBOOK_APP_ID}`,
      //     // The app only uses Facebook to sign people in. Leaving the ad/analytics
      //     // side on would put an ATT prompt and an IDFA collection disclosure into
      //     // an App Store build for tracking the app never actually does.
      //     isAutoInitEnabled: true,
      //     autoLogAppEventsEnabled: false,
      //     advertiserIDCollectionEnabled: false,
      //     iosUserTrackingPermission: false,
      //   },
      // ],
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
    owner: "soho-bd",
  },
};
