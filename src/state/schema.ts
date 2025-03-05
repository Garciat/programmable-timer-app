import { z } from "zod";

import { TimerPresetSchema } from "src/app/schema.ts";
import { DEFAULT_APP_STATE } from "src/state/default.ts";

export const UserSettingsSchema = z.object({
  ttsVoiceURI: z.string().optional(),
  sound: z.object({
    beepFrequency: z.number(),
    beepDuration: z.number(),
  }).default(DEFAULT_APP_STATE.settings.sound),
});

export const AppStateSchema = z.object({
  version: z.number(),
  presets: z.array(TimerPresetSchema),
  settings: UserSettingsSchema.default(DEFAULT_APP_STATE.settings),
});
