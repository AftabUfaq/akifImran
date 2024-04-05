export default {
  expo: {
    name: "Pomo App",
    slug: "freelance-pomodoro-timer-mobile-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      infoPlist: {
        UIBackgroundModes: ["audio", "processing"],
        NSLocalNotificationUsageDescription: "Allow notifications to receiver timer up alerts.",
        UILocalNotificationDefaultSoundName: "timeUp",
      },
      googleServicesFile: "./GoogleService-Info.plist",
      bundleIdentifier: "com.hershjoshi.pomo",
      useFrameworks: "static",
      buildNumber: "1",
      supportsTablet: true,
    },
    android: {
      googleServicesFile: "./google-services.json",
      package: "com.hershjoshi.pomo",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["SCHEDULE_EXACT_ALARM"],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Development",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/favicon.png",
          color: "#ffffff",
          sounds: ["./src/assets/sounds/timer.wav"],
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      "expo-font",
      "@react-native-google-signin/google-signin",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
    ],
    extra: {
      eas: {
        projectId: "f65567b1-f9f1-4485-94d5-4cce7eedb1cd",
      },
    },
  },
};
