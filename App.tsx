import "react-native-gesture-handler";
import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { registerRootComponent } from "expo";
import { colors } from "@theme";
import { store, persistor } from "@store";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { App } from "@";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SystemUI from "expo-system-ui";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleError(notificationId, error) {
    console.log("notification error", notificationId, error?.message);
  },
  handleSuccess(notificationId) {
    console.log("notification successful", notificationId);
  },
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
    sound: "timer.wav",
  }),
});

SystemUI.setBackgroundColorAsync(colors.white);

GoogleSignin.configure({
  // iosClientId: "175623181296-eflgs5u4g6np51ouvdfqirn7hgp7c3id.apps.googleusercontent.com",
  webClientId:
    "175623181296-84d3ujrcoqai0o02te7o2g2n4b8nk4tg.apps.googleusercontent.com",
  offlineAccess: false,
});

SplashScreen.preventAutoHideAsync();

export default function RootApp() {
  const [isAppReady, setIsAppReady] = React.useState(false);
  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();

  React.useEffect(() => {
    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    Notifications.setNotificationChannelAsync("alarm", {
      name: "Timer Notifications",
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      importance: Notifications.AndroidImportance.MAX,
      sound: "timer.wav",
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((_notification) => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      //@ts-expect-error
      Notifications.removeNotificationSubscription(
        notificationListener?.current,
      );
      //@ts-expect-error
      Notifications.removeNotificationSubscription(responseListener?.current);
    };
  }, []);

  React.useLayoutEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          "Poppins-Regular": require("./src/assets/fonts/Poppins-Regular.ttf"),
          "Poppins-Medium": require("./src/assets/fonts/Poppins-Medium.ttf"),
          "Poppins-Semibold": require("./src/assets/fonts/Poppins-SemiBold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const loader = <Text>Loading...</Text>;

  if (!isAppReady) {
    return null;
  } else {
    return (
      <RootSiblingParent>
        <SafeAreaProvider>
          <View onLayout={onLayoutRootView} style={styles.rootView}>
            <StatusBar
              backgroundColor={colors.primary}
              style={Platform.OS === "android" ? "light" : "dark"}
            />
            {/* <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}> */}
            {/* <PersistGate persistor={persistor} loading={null}>            </PersistGate> */}
            <ReduxProvider store={store}>
              <PersistGate persistor={persistor} loading={loader}>
                <NavigationContainer theme={DefaultTheme}>
                  <App />
                </NavigationContainer>
              </PersistGate>
            </ReduxProvider>
          </View>
        </SafeAreaProvider>
      </RootSiblingParent>
    );
  }
}

registerRootComponent(RootApp);

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
