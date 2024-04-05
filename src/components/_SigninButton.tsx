import {
  Image,
  ImageRequireSource,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React from "react";
import { colors, theme } from "@theme";
import { images } from "@assets";

interface OwnProps extends TouchableOpacityProps {
  onPress?: () => void;
  imageSource?: ImageRequireSource;
  label?: string;
  loading?: boolean;
}
export const _SigninButton: React.FC<OwnProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.main} {...{ onPress }}>
      <Image source={images.google} style={styles.img} />
    </TouchableOpacity>
  );
};

export default _SigninButton;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: colors.white,
    borderColor: colors.grayText,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowRadius: 2,
        shadowOffset: {
          width: 0.75,
          height: 1,
        },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  img: {
    width: 32,
    height: 32,
  },
});
