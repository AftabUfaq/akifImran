import { HzSoundsType, LofiSoundsType, RainSoundsType, SoundType } from "@constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface State {
  work: number; //minutes
  shortBreak: number; //minutes
  longBreak: number; //minutes
  lofi: LofiSoundsType;
  hz: HzSoundsType;
  hzLabel: string;
  rain: RainSoundsType;
  currentSound: "lofi" | "hz" | "rain";
  justifyContent: "flex-start" | "center" | "flex-end";
  customAudio:
    | {
        name: string;
        url: string;
      }
    | undefined;
}

const initialState: State = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  lofi: "lofi-1",
  hz: "hz-60",
  hzLabel: "60hz",
  rain: "rain-1",
  currentSound: "lofi",
  justifyContent: "flex-start",
  customAudio: undefined,
};

const valuesSlice = createSlice({
  name: "values",
  initialState: initialState,
  reducers: {
    resetValues: (state) => {
      state.work = initialState.work;
      state.shortBreak = initialState.shortBreak;
      state.longBreak = initialState.longBreak;
      state.lofi = initialState.lofi;
      state.hz = initialState.hz;
      state.hzLabel = initialState.hzLabel;
      state.rain = initialState.rain;
      state.customAudio = initialState.customAudio;
    },
    setValues: (state, action: PayloadAction<ValuePayload>) => {
      state.work = action.payload.pomodoro;
      state.shortBreak = action.payload.shortBreak;
      state.longBreak = action.payload.longBreak;
      state.lofi = action.payload.lofi;
      state.hz = action.payload.hz;
      state.hzLabel = action.payload.hzLabel;
      state.rain = action.payload.rain;
      state.customAudio = action.payload?.customAudio || undefined;
    },
    setCurrentSound: (state, action: PayloadAction<keyof SoundType>) => {
      state.currentSound = action.payload;
      if (action.payload === "lofi") state.justifyContent = "flex-start";
      else if (action.payload === "hz") state.justifyContent = "center";
      else state.justifyContent = "flex-end";
    },
  },
  extraReducers: (_builder) => {},
});

export { valuesSlice };
export const { resetValues, setValues, setCurrentSound } = valuesSlice.actions;
export const valuesReducer = valuesSlice.reducer;

interface ValuePayload {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  lofi: LofiSoundsType;
  hz: HzSoundsType;
  hzLabel: string;
  rain: RainSoundsType;
  customAudio?:
    | {
        name: string;
        url: string;
      }
    | undefined;
}
