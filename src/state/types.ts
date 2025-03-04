import { TimerPreset } from "src/app/types.ts";

export interface AppState {
  version: number;
  presets: TimerPreset[];
}

export type Action =
  | { type: "loadState"; state: AppState }
  | { type: "addPreset"; preset: Omit<TimerPreset, "id"> }
  | { type: "updatePreset"; preset: TimerPreset }
  | { type: "deletePreset"; id: string };
