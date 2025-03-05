import { z } from "zod";

import { TimerPresetSchema } from "src/app/schema.ts";
import { DEFAULT_APP_STATE } from "src/state/default.ts";
import { AppState, UserSettings } from "src/state/types.ts";

export const UserSettingsSchema = z.object({
  ttsVoiceURI: z.string().optional(),
  sound: z.object({
    beepFrequency: z.number(),
    beepDuration: z.number(),
    beepWaveform: z.enum(["sawtooth", "sine", "square", "triangle"]),
  }).default(DEFAULT_APP_STATE.settings.sound),
});

({} as z.infer<typeof UserSettingsSchema>) satisfies UserSettings;

export const AppStateSchema = z.object({
  version: z.number(),
  presets: z.array(TimerPresetSchema),
  settings: UserSettingsSchema.default(DEFAULT_APP_STATE.settings),
});

({} as z.infer<typeof AppStateSchema>) satisfies AppState;
