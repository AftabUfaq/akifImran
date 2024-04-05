import { StackScreenProps } from "@react-navigation/stack";

export type AuthStackParamsList = {
  Home: undefined;
  Settings: undefined;
  Login: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamsList> = StackScreenProps<
  AuthStackParamsList,
  T
>;
