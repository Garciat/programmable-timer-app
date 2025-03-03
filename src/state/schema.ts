import { z } from "zod";
import { TimerPresetSchema } from "../app/schema.ts";

export const AppStateSchema = z.object({
  version: z.number(),
  presets: z.array(TimerPresetSchema),
});
