import { AppState } from "src/state/types.ts";

export const DEFAULT_APP_STATE: AppState = {
  version: 1,
  presets: [],
  settings: {
    sound: {
      beepFrequency: 440,
      beepDuration: 0.2,
      beepWaveform: "sine",
    },
  },
};
