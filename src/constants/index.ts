export type LofiSoundsType = "lofi-1" | "lofi-2" | "lofi-3";
export type HzSoundsType = "hz-40" | "hz-60" | "hz-80";
export type RainSoundsType = "rain-1" | "rain-2" | "rain-3";

export type SoundType = {
  lofi: Record<LofiSoundsType, string>;
  hz: Record<HzSoundsType, string>;
  rain: Record<RainSoundsType, string>;
};

export const sounds: SoundType = {
  lofi: {
    "lofi-1": "lofi-1.mp3",
    "lofi-2": "lofi-2.mp3",
    "lofi-3": "lofi-3.mp3",
  },
  hz: {
    "hz-40": "hz-40.mp3",
    "hz-60": "hz-60.mp3",
    "hz-80": "hz-80.mp3",
  },
  rain: {
    "rain-1": "rain-1.mp3",
    "rain-2": "rain-2.mp3",
    "rain-3": "rain-3.mp3",
  },
};
export const messages = {
  error: {
    timer_error: "An error occurred. Try again!",
  },
};
