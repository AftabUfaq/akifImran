import { ImageRequireSource } from "react-native";

type IconKeys = "settings" | "refresh" | "play" | "tick" | "btnBg";
export const icons: Record<IconKeys, ImageRequireSource> = {
  settings: require("./icons/settings-icon.png"),
  refresh: require("./icons/refresh.png"),
  play: require("./icons/play.png"),
  tick: require("./icons/tick.png"),
  btnBg: require("./icons/btn-bg.png"),
};

type ImageKeys = "google" | "profile";
export const images: Record<ImageKeys, ImageRequireSource> = {
  google: require("./images/google.png"),
  profile: require("./images/profile.png"),
};
