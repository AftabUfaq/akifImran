import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { colors, theme } from "@theme";
import { AuthStackScreenProps } from "@navigation-types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FirebaseService, ToastService } from "@utility";
import { useAppDispatch } from "@store";
import { authorize, authorizeGuest } from "@slices";
import { baseStyles, textStyles } from "@styles";
import { _SigninButton } from "@components";
import { images } from "@assets";

export const Login: React.FC<AuthStackScreenProps<"Login">> = ({}) => {
  const { top } = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState({
    google: false,
  });

  const handleLoginWithGoogle = () => {
    console.log("pressed");
    setLoading((prev) => ({ ...prev, google: true }));
    FirebaseService.signInWithGoogle()
      .then((res) => {
        if (res.success) {
          if (res.data.firebase === null || res.data.user === null) return;
          dispatch(authorize(res.data.user));
        } else {
          setErrorMessage(res.message);
        }
        ToastService.show(res.message);
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, google: false }));
      });
  };

  const handleGuestLogin = () => {
    dispatch(authorizeGuest());
  };

  return (
    <View style={StyleSheet.compose(styles.main, { paddingTop: top })}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Hi, Welcome Back!</Text>
        <Text style={styles.screenSubHeading}>Please select a method to login</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.bottomTitle}>Get Started</Text>
        <_SigninButton
          onPress={handleLoginWithGoogle}
          imageSource={images.google}
          label="Continue with Google"
          loading={loading.google}
        />

        {errorMessage ? <Text style={textStyles.errorText}>{errorMessage}</Text> : null}

        <Text style={textStyles.subText}>- or -</Text>

        <Pressable style={styles.btn} onPress={handleGuestLogin}>
          <Text allowFontScaling style={styles.btnText}>
            Continue as Guest
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  screenTitle: {
    ...baseStyles.title,
    color: colors.white,
  },
  bottomTitle: {
    ...baseStyles.title,
    color: colors.black,
  },
  screenSubHeading: {
    ...baseStyles.subTitle,
    color: colors.white,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },

  header: {
    flex: 2.5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 2.5,
    flexDirection: "column",
    alignItems: "center",
    rowGap: theme.spacing.xl,
    backgroundColor: colors.white,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  btn: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: theme.radius.full,
    width: "100%",
  },
  btnText: {
    ...textStyles.onPrimary,
    textAlign: "center",
    // borderWidth: 1,
  },
});
