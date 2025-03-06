import { TimerPreset } from "src/app/types.ts";

export function snapshotPreset(preset: TimerPreset): string {
  return JSON.stringify(preset);
}
