import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, theme } from "@theme";
import { images } from "@assets";
import { baseStyles, gStyles, textStyles } from "@styles";
import { AuthStackScreenProps } from "@navigation-types";
import { selectAuth, selectValues, useAppDispatch, useAppSelector } from "@store";
import { revoke, setValues } from "@slices";
import { ToastService } from "@utility";
import { useFormik } from "formik";
import * as yup from "yup";
import { HzSoundsType, LofiSoundsType, RainSoundsType, sounds } from "@constants";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

interface IForm {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  lofi: LofiSoundsType;
  hz: HzSoundsType;
  hzLabel: string;
  rain: RainSoundsType;
  hasCustomAudio: boolean;
  customAudio?: {
    name: string;
    url: string;
  };
}
const schema = yup.object().shape({
  pomodoro: yup
    .number()
    .min(1, "You really wanna work less than a minute, huh?")
    .max(60, "Calm down an hour of continuous work is good too.")
    .required("Pomodoro timer is required"),
  shortBreak: yup.number().min(1).max(60).required("Short break timer is required"),
  longBreak: yup.number().min(1).max(60).required("Long break timer is required"),
  lofi: yup
    .string()
    .oneOf([...Object.keys(sounds.lofi)])
    .required("Lofi sound selection is required"),
  hz: yup
    .string()
    .oneOf([...Object.keys(sounds.hz)])
    .required("Hz sound selection is required"),
  hzLabel: yup.string().required("Hz sound selection is required"),
  rain: yup
    .string()
    .oneOf([...Object.keys(sounds.rain)])
    .required("Rain sound selection is required"),
  hasCustomAudio: yup.boolean().required(),
  customAudio: yup
    .object()
    .shape({
      name: yup.string().when("hasCustomAudio", {
        is: true,
        then: (schema) => schema.required("Custom audio file name is required"),
        otherwise: (schema) => schema.optional(),
      }),
      url: yup.string().when("hasCustomAudio", {
        is: true,
        then: (schema) => schema.required("Custom audio file path is required"),
        otherwise: (schema) => schema.optional(),
      }),
    })
    .when("hasCustomAudio", {
      is: true,
      then: (schema) => schema.required("Custom audio file path is required"),
      otherwise: (schema) => schema.optional(),
    }),
});

export const Settings: React.FC<AuthStackScreenProps<"Settings">> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { work, shortBreak, longBreak, lofi, hz, rain, customAudio, hzLabel } =
    useAppSelector(selectValues);

  const form = useFormik<IForm>({
    initialValues: {
      pomodoro: work,
      shortBreak: shortBreak,
      longBreak: longBreak,
      hz: hz,
      hzLabel: hzLabel,
      lofi: lofi,
      rain: rain,
      hasCustomAudio: customAudio?.url ? true : false,
      customAudio: customAudio,
    },
    validationSchema: schema,
    onSubmit: (values, _helpers) => {
      console.log(values);
      new Promise<void>((resolve) => {
        dispatch(setValues(values));
        resolve();
      }).then(() => {
        ToastService.show("Settings saved");
        navigation.goBack();
      });
    },
  });

  const handlePickCustomAudio = () => {
    DocumentPicker.getDocumentAsync({
      type: "audio/mpeg",
      copyToCacheDirectory: true,
      multiple: false,
    }).then((result) => {
      const { canceled, assets } = result;
      if (!canceled) {
        const value = assets.at(0);
        if (!value) {
          ToastService.show("No file selected");
          return;
        }
        form.setValues((prev) => ({
          ...prev,
          customAudio: {
            name: value.name,
            url: value.uri,
          },
          hasCustomAudio: true,
        }));
      } else {
        ToastService.show("Custom audio not added");
      }
    });
  };

  const handleRemoveCustomAudio = () => {
    form.setValues((prev) => ({ ...prev, customAudio: undefined, hasCustomAudio: false }));
  };

  const handleLogout = () => {
    dispatch(revoke());
  };

  /*   const handleReset = () => {
    ToastService.show("Under development");
  }; */

  console.log(form.errors);
  console.log(form.values);
  return (
    <SafeAreaView style={styles.main} mode="padding">
      <ScrollView contentContainerStyle={styles.scrollStyle} showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <React.Fragment>
            <View style={gStyles.topBtnContainer}>
              <TouchableOpacity
                style={styles.profileBadge}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Image
                  source={user.photoURL ? { uri: user.photoURL } : images.profile}
                  style={styles.profileImg}
                />
                <View>
                  <Text style={gStyles.tblHeaderText}>{user.displayName}</Text>
                  <Text style={gStyles.tblDescText}>{user.email}</Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity style={[gStyles.btn, gStyles.bg_gray]} onPress={handleReset}>
                <Image source={icons.refresh} style={gStyles.img} />
              </TouchableOpacity> */}
            </View>

            <View style={styles.settingModal}>
              <View style={styles.contentContainer}>
                <Text style={styles.settingsTitle}>Settings</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.contentContainer}>
                <Text style={[styles.mdTitle, baseStyles.whiteText]}>Time (minutes)</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.labelAlignment}>
                    <Text style={[baseStyles.unselectedText, baseStyles.alphaWhiteText]}>
                      pomodoro
                    </Text>
                    <Text style={[baseStyles.unselectedText, baseStyles.alphaWhiteText]}>
                      short break
                    </Text>
                    <Text style={[baseStyles.unselectedText, baseStyles.alphaWhiteText]}>
                      long break
                    </Text>
                  </View>
                  <View style={styles.inputAlignment}>
                    <View>
                      <TextInput
                        value={form.values.pomodoro.toString()}
                        style={styles.input}
                        id="pomodoro"
                        onChangeText={form.handleChange("pomodoro")}
                        onBlur={form.handleBlur("pomodoro")}
                        textContentType="none"
                        keyboardType="numeric"
                      />
                      {form.errors.pomodoro && form.touched.pomodoro ? (
                        <Text style={textStyles.smErrorText}>{form.errors.pomodoro}</Text>
                      ) : null}
                    </View>
                    <View>
                      <TextInput
                        value={form.values.shortBreak.toString()}
                        style={styles.input}
                        id="shortBreak"
                        onChangeText={form.handleChange("shortBreak")}
                        onBlur={form.handleBlur("shortBreak")}
                        textContentType="none"
                        keyboardType="numeric"
                      />
                      {form.errors.shortBreak && form.touched.shortBreak ? (
                        <Text style={textStyles.smErrorText}>{form.errors.shortBreak}</Text>
                      ) : null}
                    </View>
                    <View>
                      <TextInput
                        value={form.values.longBreak.toString()}
                        style={styles.input}
                        id="longBreak"
                        onChangeText={form.handleChange("longBreak")}
                        onBlur={form.handleBlur("longBreak")}
                        textContentType="none"
                        keyboardType="numeric"
                      />
                      {form.errors.longBreak && form.touched.longBreak ? (
                        <Text style={textStyles.smErrorText}>{form.errors.longBreak}</Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />
              <Text style={[styles.mdTitle, baseStyles.whiteText]}>Audio Selected</Text>
              <View style={styles.contentContainer}>
                {/* lofi beats */}
                <View style={styles.audioSelectionContainer}>
                  <View style={styles.audioCol}>
                    <TouchableOpacity onPress={() => form.setFieldValue("lofi", "lofi-1")}>
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.lofi === "lofi-1"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        Lofi 1
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        form.setFieldValue("hz", "hz-40");
                        form.setFieldValue("hzLabel", "40hz");
                      }}
                    >
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.hz === "hz-40"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        40 Hz
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => form.setFieldValue("rain", "rain-1")}>
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.rain === "rain-1"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        Rain 1
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.audioCol}>
                    <TouchableOpacity onPress={() => form.setFieldValue("lofi", "lofi-2")}>
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.lofi === "lofi-2"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        Lofi 2
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        form.setFieldValue("hz", "hz-60");
                        form.setFieldValue("hzLabel", "60hz");
                      }}
                    >
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.hz === "hz-60"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        60 Hz
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => form.setFieldValue("rain", "rain-2")}>
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.rain === "rain-2"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        Rain 2
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.audioCol}>
                    <TouchableOpacity onPress={() => form.setFieldValue("lofi", "lofi-3")}>
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.lofi === "lofi-3"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        Lofi 3
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        form.setFieldValue("hz", "hz-80");
                        form.setFieldValue("hzLabel", "80hz");
                      }}
                    >
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.hz === "hz-80"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        80 Hz
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => form.setFieldValue("rain", "rain-3")}>
                      <Text
                        style={[
                          baseStyles.alphaWhiteText,
                          form.values.rain === "rain-3"
                            ? baseStyles.selectedText
                            : baseStyles.unselectedText,
                        ]}
                      >
                        Rain 3
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.audioSelectionContainer}>
                  <View style={styles.audioCol}>
                    <View style={styles.customAudioRowContainer}>
                      <TouchableOpacity onPress={handlePickCustomAudio}>
                        <Text style={[baseStyles.unselectedText, baseStyles.alphaWhiteText]}>
                          Add custom audio
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleRemoveCustomAudio}
                        style={styles.removeCustomAudioBtn}
                      >
                        <FontAwesome name="remove" size={24} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={gStyles.fabContainer}>
              <TouchableOpacity style={gStyles.fab} onPress={() => form.handleSubmit()}>
                {/* <Image source={icons.tick} style={gStyles.img} resizeMode="contain" /> */}
                <FontAwesome6 name="check" size={32} color={colors.white} />
              </TouchableOpacity>
            </View>
          </React.Fragment>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  scrollStyle: {
    paddingHorizontal: theme.spacing.xl,
  },
  profileBadge: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
    backgroundColor: colors.gray,
    borderRadius: theme.radius.sm,
  },
  profileImg: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
  },
  settingModal: {
    marginTop: theme.spacing.xl * 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    borderRadius: theme.radius.xl * 1.5,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    // borderWidth: 1,
  },
  contentContainer: {
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    alignItems: "center",
    // borderWidth: 1,
  },
  settingsTitle: {
    ...baseStyles.modalTitle,
    color: colors.white,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: colors.divider,
    marginVertical: theme.spacing.sm,
  },
  mdTitle: {
    ...baseStyles.mdTitle,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginVertical: theme.spacing.xs,
    // borderWidth: 1,
  },
  labelAlignment: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-around",
    rowGap: theme.spacing.xl,
    // borderWidth: 1,
  },
  inputAlignment: {
    flex: 1.25,
    alignItems: "flex-start",
    rowGap: theme.spacing.sm,
    // borderWidth: 1,
  },
  input: {
    color: colors.white,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: colors.divider,
    width: 124,
    borderRadius: theme.radius.lg,
  },
  audioSelectionContainer: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingVertical: theme.spacing.sm,
    // borderWidth: 1,
  },
  audioCol: {
    flex: 1,
    flexDirection: "column",
    rowGap: theme.spacing.md,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: theme.spacing.xs,
    // borderWidth: 1,
  },
  customAudioRowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  removeCustomAudioBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: colors.onPrimaryBackground,
    // borderWidth: 1,
  },
});
