import { z } from "zod";
import { TimerPresetSchema } from "../app/schema.ts";

export const AppStateSchema = z.object({
  presets: z.array(TimerPresetSchema),
});
