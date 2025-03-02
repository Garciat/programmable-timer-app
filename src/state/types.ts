import { TimerPreset } from "../app/types.ts";

export interface AppState {
  presets: TimerPreset[];
}

export type Action =
  | { type: "addPreset"; preset: Omit<TimerPreset, "id"> }
  | { type: "updatePreset"; preset: TimerPreset }
  | { type: "deletePreset"; id: string };
