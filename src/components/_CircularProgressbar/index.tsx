import { Dimensions, Platform, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React from "react";
import Svg, { Circle } from "react-native-svg";
import { colors, theme } from "@theme";
import { selectTimer, selectValues, useAppDispatch, useAppSelector } from "@store";
import { finish } from "@slices";
import * as Notifications from "expo-notifications";
import BackgroundTimer from "react-native-background-timer";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get("window");
const size = width - 96;
const strokeWidth = 14;
const radius = (size - strokeWidth) / 2;
const circumference = (radius - 15) * 2 * Math.PI;

interface OwnProps {
  resetSound(): Promise<void>;
}
export const _CircularProgressBar: React.FC<OwnProps> = ({ resetSound }) => {
  const dispatch = useAppDispatch();
  const { work, longBreak, shortBreak } = useAppSelector(selectValues);
  const { isPlaying, isBreak, isPaused, timerRef, worked } = useAppSelector(selectTimer);
  const [timer, setTimer] = React.useState(0);
  const progress = useSharedValue(0);
  // const ref = useRef<NodeJS.Timeout>(null);
  // const a = interpolate(progress, [0, 1], [0, Math.PI * 2]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * progress.value,
  }));

  // const animatedText = useDerivedValue(() => `${Math.floor(progress.value * 5)}`);
  // const animatedTextProps = useAnimatedProps(() => {
  //   return {
  //     text: animatedText.value,
  //   };
  // });

  // const onFinish = React.useCallback(async () => {
  //   dispatch(finish());
  //   BackgroundTimer.stopBackgroundTimer();
  //   await resetSound();
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: isBreak ? "Rest is over." : "Time to rest.",
  //       body: isBreak ? "Time to get back to work." : "Take a rest to freshen up.",
  //       data: { data: "goes here" },
  //       sound: Platform.OS === "ios" ? "timer.wav" : true,
  //       priority: Notifications.AndroidNotificationPriority.MAX,
  //     },
  //     trigger: {
  //       seconds: 1,
  //       channelId: "alarm",
  //     },
  //   });
  // }, [dispatch, resetSound, isBreak]);

  React.useEffect(() => {
    console.log("circular useEffect ran");
    const breakTime = worked % 4 === 0 ? longBreak : shortBreak;
    const value = isBreak ? breakTime : work;
    if (!isPlaying) {
      if (isPaused) {
        cancelAnimation(progress);
        clearInterval(timerRef);
        BackgroundTimer.stopBackgroundTimer();
      } else {
        progress.value = withTiming(0, { duration: 0 });
        setTimer(value * 60);
        BackgroundTimer.stopBackgroundTimer();
      }
      return;
    }
    progress.value = withTiming(1, {
      duration: value * 60 * 1000,
      easing: Easing.linear,
    });
    // const setter = Platform.OS === "ios" ? setInterval : BackgroundTimer.setInterval;
    // const ref =
    BackgroundTimer.runBackgroundTimer(() => {
      setTimer((prev) => {
        console.log(prev);
        if (prev <= 0) {
          // onFinish();
          (async () => {
            dispatch(finish());
            // BackgroundTimer.stopBackgroundTimer();
            await resetSound();
            await Notifications.scheduleNotificationAsync({
              content: {
                title: isBreak ? "Rest is over." : "Time to rest.",
                body: isBreak ? "Time to get back to work." : "Take a rest to freshen up.",
                data: { data: "goes here" },
                sound: Platform.OS === "ios" ? "timer.wav" : true,
                priority: Notifications.AndroidNotificationPriority.MAX,
              },
              trigger: {
                seconds: 1,
                channelId: "alarm",
              },
            });
          })();
          progress.value = withTiming(1, { duration: 0 });
          return 0;
        } else return prev - 1;
      });
    }, 1000);
    // dispatch(setTimerRef(ref));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isBreak, work, longBreak, shortBreak, worked]);

  return (
    <React.Fragment>
      <Svg width={size} height={size}>
        <Circle fill={colors.primary} cx={size / 2} cy={size / 2} r={radius} />
        <AnimatedCircle
          stroke={colors.white}
          strokeLinecap={"round"}
          fill={"none"}
          cx={size / 2}
          cy={size / 2}
          r={radius - 18}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          {...{ strokeWidth }}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text style={styles.timerText}>{`${Math.floor(timer / 60)
        .toString()
        .padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`}</Text>
    </React.Fragment>
  );
};

export default _CircularProgressBar;
const styles = StyleSheet.create({
  timerText: {
    position: "absolute",
    fontSize: theme.font.size.xl,
    fontFamily: theme.font.family.regular,
    color: colors.white,
  },
});
