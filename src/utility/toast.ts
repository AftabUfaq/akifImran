import Toast from "react-native-root-toast";
import type { ToastOptions } from "react-native-root-toast";

export class ToastService {
  private static config: ToastOptions = {
    animation: true,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    textStyle: {
      fontSize: 14,
      textAlignVertical: "center",
    },
    keyboardAvoiding: true,
    accessible: false,
    hideOnPress: false,
  };
  static show = (message: string) => {
    Toast.show(message, ToastService.config);
  };
}
