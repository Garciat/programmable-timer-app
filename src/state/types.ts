import { TimerPreset } from "src/app/types.ts";

export interface AppState {
  version: number;
  presets: TimerPreset[];
  settings: UserSettings;
}

export interface UserSettings {
  ttsVoiceURI?: string;
  sound: UserSoundSettings;
}

export interface UserSoundSettings {
  beepFrequency: number;
  beepDuration: number;
}

export type Action =
  | { type: "loadState"; state: AppState }
  | { type: "addPreset"; preset: Omit<TimerPreset, "id"> }
  | { type: "updatePreset"; preset: TimerPreset }
  | { type: "deletePreset"; id: string }
  | {
    type: "updateSettings";
    updater: (settings: UserSettings) => UserSettings;
  };
