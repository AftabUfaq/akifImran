import auth from "@react-native-firebase/auth";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { ToastService } from "./toast";

export type UserReturnType =
  | {
      success: false;
      data: null;
      message: string;
    }
  | {
      success: true;
      data: {
        user: Omit<IAuthUser, "balance" | "age">;
        firebase: IAuthFirebaseInfo;
      };
      message: string;
    };

type CreateAccountWithGoogle = (idToken: string | null) => Promise<UserReturnType>;

type SignInWithGoogle = () => Promise<UserReturnType>;

type HasAccount = () => Promise<
  | {
      idToken: string | null;
      hasAccount: false;
      accounts: string[];
    }
  | {
      idToken: string | null;
      hasAccount: true;
      accounts: string[];
    }
>;

type signInWithEmailAndPassword = (email: string, password: string) => Promise<UserReturnType>;
export class FirebaseService {
  public static hasAccount: HasAccount = async () => {
    const {
      idToken,
      user: { email },
    } = await GoogleSignin.signIn();
    const signInMethods = await auth().fetchSignInMethodsForEmail(email);
    if (signInMethods.length !== 0) {
      ToastService.show("This email already exists. Please Login");
      return {
        idToken,
        hasAccount: true,
        accounts: signInMethods,
      };
    }
    return {
      idToken,
      hasAccount: false,
      accounts: signInMethods,
    };
  };

  public static createAccountGoogle: CreateAccountWithGoogle = async (idToken: string | null) => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!hasPlayServices) {
        return {
          data: null,
          success: false,
          message: "Play services are not available",
        };
      }
      const credential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(credential);
      if (user.user.providerData.length > 0) {
        const details = user.user.providerData[0];
        const rUser = {
          displayName: details?.displayName || "",
          email: details?.email || "",
          photoURL: details?.photoURL || "",
          providerId: details?.providerId || "",
          uid: details?.uid || "",
        };
        const rFirebase = {
          idToken: await user.user.getIdToken(),
          uid: user.user.uid,
        };
        return {
          success: true,
          message: "Google Sign-In Successful!",
          data: {
            user: rUser,
            firebase: rFirebase,
          },
        };
      }
    } catch (error: any) {
      console.log("FirebaseService.signInWithGoogle =>", error);
      let message = "";
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          message = "Google Sign-In Cancelled";
          break;
        case statusCodes.IN_PROGRESS:
          message = "Google Sign-In In Progress";
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          message = "Google Sign-In Play Services Not Available";
          break;
        case statusCodes.SIGN_IN_REQUIRED:
          message = "Google Sign-In Required";
          break;
        default:
          message = "Google Sign-In Failed";
          break;
      }
      return {
        success: false,
        message,
        data: null,
      };
    }
    return {
      data: null,
      success: false,
      message: "Google Sign-In Failed",
    };
  };

  public static signInWithGoogle: SignInWithGoogle = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!hasPlayServices) {
        return {
          data: null,
          success: false,
          message: "Play services are not available",
        };
      }
      const { idToken } = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(idToken);
      const user = await auth().signInWithCredential(credential);
      if (user.user.providerData.length > 0) {
        const details = user.user.providerData[0];
        const rUser = {
          displayName: details?.displayName || "",
          email: details?.email || "",
          photoURL: details?.photoURL || "",
          providerId: details?.providerId || "",
          uid: details?.uid || "",
        };
        const rFirebase = {
          idToken: await user.user.getIdToken(),
          uid: user.user.uid,
        };
        return {
          success: true,
          message: "Google Sign-In Successful!",
          data: {
            user: rUser,
            firebase: rFirebase,
          },
        };
      }
    } catch (error: any) {
      console.log("FirebaseService.signInWithGoogle =>", JSON.stringify(error));
      let message = "";
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          message = "Google Sign-In Cancelled";
          break;
        case statusCodes.IN_PROGRESS:
          message = "Google Sign-In In Progress";
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          message = "Google Sign-In Play Services Not Available";
          break;
        case statusCodes.SIGN_IN_REQUIRED:
          message = "Google Sign-In Required";
          break;
        default:
          message = "Google Sign-In Failed";
          break;
      }
      return {
        success: false,
        message,
        data: null,
      };
    }
    return {
      data: null,
      success: false,
      message: "Google Sign-In Failed",
    };
  };

  public static signInWithEmailAndPassword: signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    try {
      const user = await auth().signInWithEmailAndPassword(email, password);
      if (user.user.providerData.length > 0) {
        const details = user.user.providerData[0];
        const rUser = {
          displayName: details?.displayName || "",
          email: details?.email || "",
          photoURL: details?.photoURL || "",
          providerId: details?.providerId || "",
          uid: details?.uid || "",
        };
        const rFirebase = {
          idToken: await user.user.getIdToken(),
          uid: user.user.uid,
        };
        return {
          success: true,
          message: "Email Sign-In Successful!",
          data: {
            user: rUser,
            firebase: rFirebase,
          },
        };
      }
    } catch (error: any) {
      console.log("error", error?.code);
      let message = "";
      switch (error.code) {
        case "auth/invalid-email":
          message = "Invalid email. Please try again.";
          break;
        case "auth/user-disabled":
          message = "User is disabled. Please contact support";
          break;
        case "auth/user-not-found":
          message = "User not found. Check email.";
          break;
        case "auth/wrong-password":
          message = "Invalid password";
          break;
        default:
          message = "Sign in Failed";
          break;
      }
      return {
        message,
        success: false,
        data: null,
      };
    }
    return {
      data: null,
      success: false,
      message: "Sign in Failed",
    };
  };
}
