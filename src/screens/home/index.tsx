import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, theme } from "@theme";
import { _CircularProgressBar } from "@components";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { selectTimer, selectValues, useAppDispatch, useAppSelector } from "@store";
import { play, pause, reset, setCurrentSound, sessionReset } from "@slices";
import { AuthStackScreenProps } from "@navigation-types";
import { gStyles } from "@styles";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import storage from "@react-native-firebase/storage";
import { ToastService } from "@utility";
import { SoundType, sounds } from "@constants";
import BackgroundTimer from "react-native-background-timer";

export const Home: React.FC<AuthStackScreenProps<"Home">> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isPlaying } = useAppSelector(selectTimer);
  const { lofi, hz, rain, hzLabel, customAudio, currentSound, justifyContent } =
    useAppSelector(selectValues);
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [soundLoaded, setSoundLoaded] = React.useState(false);

  const start = () => {
    if (isPlaying) {
      dispatch(pause());
      pauseSound();
    } else {
      dispatch(play());
      playSound();
    }
  };

  const handleReset = () => {
    dispatch(reset());
    resetSound();
    BackgroundTimer.stopBackgroundTimer();
    ToastService.show("Long press to reset session");
  };

  const handleSessionReset = () => {
    dispatch(sessionReset());
    resetSound();
    BackgroundTimer.stopBackgroundTimer();
  };

  const handleInvalidSoundChange = () => {
    ToastService.show("Change sound before starting timer.");
  };

  const handleChangeCurrentSound = (type: keyof SoundType) => {
    dispatch(setCurrentSound(type));
  };

  async function playSound() {
    try {
      console.log(sound ? "has sound" : "no sound");
      await sound?.playAsync();
    } catch (e) {
      console.warn(e);
      ToastService.show("Error playing sound");
    }
  }

  async function pauseSound() {
    try {
      await sound?.pauseAsync();
    } catch (e) {
      console.warn(e);
      ToastService.show("Error playing sound");
    }
  }

  async function resetSound() {
    try {
      await sound?.stopAsync();
    } catch (e) {
      console.warn(e);
      ToastService.show("Error stopping sound");
    }
  }

  React.useEffect(() => {
    setSoundLoaded((_prev) => false);
    async function loadSound() {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      let url: string;
      if (customAudio?.url && currentSound === "rain") {
        url = customAudio?.url;
        console.log(url, "url");
      } else {
        let ref: string = sounds.lofi[lofi];
        if (currentSound === "lofi") ref = sounds.lofi[lofi];
        else if (currentSound === "hz") ref = sounds.hz[hz];
        else if (currentSound === "rain") ref = sounds.rain[rain];
        console.log(ref, "ref");
        url = await storage().ref().child(ref).getDownloadURL();
      }
      console.log(url, "url");
      if (typeof url !== "string") return;
      try {
        const { sound, status } = await Audio.Sound.createAsync({ uri: url }, { isLooping: true });
        console.log(status, "status");
        setSound(sound);
      } catch (e) {
        console.warn(e);
        ToastService.show("Error loading sound");
      }
    }
    loadSound().then(() => {
      setSoundLoaded((_prev) => true);
    });
  }, [currentSound, hz, lofi, rain, customAudio?.url]);

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView style={styles.main} mode="padding">
      <View style={gStyles.topBtnContainer}>
        <TouchableOpacity
          style={gStyles.btn}
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          {/* <Image source={icons.settings} style={gStyles.img} /> */}
          <MaterialIcons name="settings" size={32} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[gStyles.btn, gStyles.bg_gray]}
          onPress={handleReset}
          onLongPress={handleSessionReset}
        >
          {/* <Image source={icons.refresh} style={gStyles.img} /> */}
          <MaterialIcons name="refresh" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.widgetContainer}>
        <View style={styles.timerContainer}>
          <_CircularProgressBar resetSound={resetSound} />
        </View>

        <View style={styles.infoBarContainer}>
          <View style={styles.soundTextContainer}>
            <TouchableOpacity
              onPress={
                isPlaying ? handleInvalidSoundChange : () => handleChangeCurrentSound("lofi")
              }
            >
              <Text
                style={currentSound === "lofi" ? styles.soundTextActive : styles.soundTextInactive}
              >
                Lofi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isPlaying ? handleInvalidSoundChange : () => handleChangeCurrentSound("hz")}
            >
              <Text
                style={currentSound === "hz" ? styles.soundTextActive : styles.soundTextInactive}
              >
                {hzLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={
                isPlaying ? handleInvalidSoundChange : () => handleChangeCurrentSound("rain")
              }
            >
              <Text
                style={currentSound === "rain" ? styles.soundTextActive : styles.soundTextInactive}
              >
                {customAudio?.url ? "Custom" : "Rain"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={StyleSheet.compose(styles.soundActiveIndicatorContainer, {
              justifyContent,
            })}
          >
            <View style={styles.activeIndicator} />
          </View>
        </View>
      </View>

      <View style={gStyles.fabContainer}>
        <TouchableOpacity
          style={gStyles.fab}
          onPress={soundLoaded ? start : undefined}
          disabled={!soundLoaded}
        >
          {soundLoaded ? (
            <>
              {isPlaying ? (
                <FontAwesome5 name="pause" size={32} color={colors.white} />
              ) : (
                // <Image source={icons.play} style={gStyles.img} resizeMode="contain" />
                <FontAwesome5 name="play" size={32} color={colors.white} />
              )}
            </>
          ) : (
            <ActivityIndicator size={"small"} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },

  widgetContainer: {
    flex: 8,
    justifyContent: "flex-start",
    paddingVertical: theme.spacing.xl,
    // borderWidth: 1,
  },
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
  },
  infoBarContainer: {
    flex: 1,
    justifyContent: "center",
    // borderWidth: 1,
  },
  soundTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: theme.spacing.xl,
  },
  soundTextInactive: {
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.family.medium,
    color: colors.grayText,
  },
  soundTextActive: {
    fontSize: theme.font.size.lg,
    fontFamily: theme.font.family.medium,
    color: colors.primary,
  },
  soundActiveIndicatorContainer: {
    marginHorizontal: theme.spacing.xl,
    backgroundColor: colors.gray,
    borderRadius: theme.radius.xl,
    flexDirection: "row",
    justifyContent: "center",
  },
  activeIndicator: {
    borderRadius: theme.radius.xl,
    width: theme.font.size.lg * 2,
    height: 8,
    backgroundColor: colors.primary,
  },
});
