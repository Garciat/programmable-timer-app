import { z } from "zod";

import { TimerPresetSchema } from "src/app/schema.ts";

export const UserSettingsSchema = z.object({
  ttsVoiceURI: z.string().optional(),
});

export const AppStateSchema = z.object({
  version: z.number(),
  presets: z.array(TimerPresetSchema),
  settings: UserSettingsSchema.default({}),
});
