interface IAuthUser {
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string; //google.com / facebook.com etc
  uid: string;
  balance: {
    amount: number;
    currency: string;
  };
  age: number;
}
interface IAuthFirebaseInfo {
  idToken: string;
  uid: string;
}
