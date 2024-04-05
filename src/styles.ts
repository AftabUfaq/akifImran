import { colors, theme } from "@theme";
import { StyleSheet } from "react-native";

export const baseStyles = StyleSheet.create({
  title: {
    fontFamily: theme.font.family.medium,
    fontSize: theme.font.size.lg,
    lineHeight: 32,
    letterSpacing: (0.5 / 100) * theme.font.size.lg,
  },
  mdTitle: {
    fontFamily: theme.font.family.semi_bold,
    fontSize: theme.font.size.md,
    lineHeight: 27,
  },
  modalTitle: {
    fontFamily: theme.font.family.semi_bold,
    fontSize: theme.font.size.lg,
    lineHeight: 36,
    letterSpacing: (0.5 / 100) * theme.font.size.lg,
  },
  subTitle: {
    fontFamily: theme.font.family.regular,
    fontSize: theme.font.size.sm,
    lineHeight: 22,
    letterSpacing: (0.5 / 100) * theme.font.size.sm,
  },
  headerText: {
    fontFamily: theme.font.family.semi_bold,
    fontSize: theme.font.size.sm,
    lineHeight: 22,
    letterSpacing: (0.5 / 100) * theme.font.size.sm,
  },
  tblHeaderText: {
    fontFamily: theme.font.family.semi_bold,
    fontSize: theme.font.size.xs,
    lineHeight: 16,
    letterSpacing: (0.5 / 100) * theme.font.size.xs,
  },
  tblDescText: {
    fontFamily: theme.font.family.regular,
    fontSize: theme.font.size.xs,
    lineHeight: 16,
    letterSpacing: (0.5 / 100) * theme.font.size.xs,
  },
  unselectedText: {
    fontFamily: theme.font.family.medium,
    fontSize: theme.font.size.md,
    lineHeight: 27,
    letterSpacing: (0.5 / 100) * theme.font.size.md,
  },
  selectedText: {
    fontFamily: theme.font.family.semi_bold,
    fontSize: theme.font.size.md,
    lineHeight: 27,
    letterSpacing: (0.5 / 100) * theme.font.size.md,
    color: colors.white,
  },
  whiteText: {
    color: colors.white,
  },
  alphaWhiteText: {
    color: colors.alphaWhite,
  },
  blackText: {
    color: colors.black,
  },
  grayText: {
    color: colors.grayScale70,
  },
  redText: {
    color: colors.error,
  },
});

export const textStyles = StyleSheet.create({
  screenTitles: {
    ...baseStyles.title,
    color: colors.white,
    textAlign: "center",
  },
  subText: {
    ...baseStyles.subTitle,
    color: colors.grayScale70,
    textAlign: "center",
  },
  errorText: {
    ...baseStyles.subTitle,
    fontSize: theme.font.size.sm,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    color: colors.error,
  },
  smErrorText: {
    ...baseStyles.subTitle,
    fontSize: theme.font.size.xs,
    textAlign: "left",
    color: colors.error,
  },
  onPrimary: {
    ...baseStyles.headerText,
    color: colors.white,
  },
});

export const gStyles = StyleSheet.create({
  topBtnContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // borderWidth: 1,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    // borderWidth: 1,
  },
  fabContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    // borderWidth: 1,
  },
  fab: {
    // position: "absolute",
    // bottom: theme.spacing.xl,
    // right: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 96,
    height: 96,
    borderRadius: theme.radius.full,
    backgroundColor: colors.primary,
  },
  img: {
    width: 32,
    height: 32,
  },
  bg_gray: {
    backgroundColor: colors.gray,
  },
  tblHeaderText: {
    ...baseStyles.tblHeaderText,
    color: colors.titleText,
  },
  tblDescText: {
    ...baseStyles.tblDescText,
    color: colors.titleText,
  },
});
