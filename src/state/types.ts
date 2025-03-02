import { TimerPreset } from "../app/types.ts";

export interface AppState {
  preset: TimerPreset;
}

export type Action = { type: "setPreset"; preset: TimerPreset };
