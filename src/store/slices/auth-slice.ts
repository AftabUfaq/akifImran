import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IUser {
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string;
  uid: string;
}
interface State {
  isAuthorized: boolean;
  user: IUser;
}

const initialState: State = {
  isAuthorized: false,
  user: {
    displayName: "",
    email: "",
    photoURL: "",
    providerId: "",
    uid: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    authorizeGuest: (state) => {
      state.isAuthorized = true;
      state.user = {
        displayName: "Guest",
        email: "guest@example.com",
        photoURL: "",
        providerId: "",
        uid: "",
      };
    },
    authorize: (state, action: PayloadAction<IUser>) => {
      state.isAuthorized = true;
      state.user = action.payload;
    },
    revoke: (state) => {
      state.isAuthorized = false;
    },
  },
  extraReducers: (_builder) => {},
});

export { authSlice };
export const { authorize, revoke, authorizeGuest } = authSlice.actions;
export const authReducer = authSlice.reducer;
