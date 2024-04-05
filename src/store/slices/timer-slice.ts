import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface State {
  worked: number; //number of times worked
  breaks: number; //no. of break;
  isBreak: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  stamp: number; //milliseconds since 1970 epoch
  timerRef: string | number | NodeJS.Timeout | undefined;
}

const initialState: State = {
  worked: 0,
  breaks: 0,
  isBreak: false,
  isPaused: false,
  isPlaying: false,
  stamp: 0,
  timerRef: undefined,
};

const timerSlice = createSlice({
  name: "timer",
  initialState: initialState,
  reducers: {
    play: (state) => {
      state.isPlaying = true;
      state.stamp = Date.now();
      state.isPaused = false;
    },
    stop: (state) => {
      state.isPlaying = false;
      state.isBreak = true;
    },
    finish: (state) => {
      state.isPlaying = false;
      if (state.isBreak) {
        state.breaks = state.breaks + 1;
      } else {
        state.worked = state.worked + 1;
      }
      // Platform.OS === "android" && typeof state?.timerRef === "number"
      //   ? BackgroundTimer.clearInterval(state?.timerRef)
      //   : clearInterval(state.timerRef);
      state.timerRef = undefined;
      state.isBreak = !state.isBreak;
    },
    sessionReset: (state) => {
      state.worked = initialState.worked;
      state.breaks = initialState.breaks;
      state.isBreak = initialState.isBreak;
      state.isPaused = initialState.isPaused;
      state.isPlaying = initialState.isPlaying;
      state.stamp = initialState.stamp;
      state.timerRef = initialState.timerRef;
    },
    reset: (state) => {
      // state.worked = initialState.worked;
      // state.breaks = initialState.breaks;
      // state.isBreak = initialState.isBreak;
      // state.isPaused = initialState.isPaused;
      // state.isPlaying = initialState.isPlaying;
      state.isPaused = false;
      state.isPlaying = false;
      state.stamp = initialState.stamp;
      // Platform.OS === "android" && typeof state?.timerRef === "number"
      //   ? BackgroundTimer.clearInterval(state?.timerRef)
      //   : clearInterval(state.timerRef);
      state.timerRef = initialState.timerRef;
    },
    pause: (state) => {
      state.isPaused = true;
      state.isPlaying = false;
      state.stamp = Date.now();
    },
    setTimerRef: (state, action: PayloadAction<string | number | NodeJS.Timeout | undefined>) => {
      state.timerRef = action.payload;
    },
  },
  extraReducers: (_builder) => {},
});

export { timerSlice };
export const { play, stop, setTimerRef, pause, reset, finish, sessionReset } = timerSlice.actions;
export const timerReducer = timerSlice.reducer;
