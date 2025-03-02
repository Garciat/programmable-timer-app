import { z } from "zod";

import { TimerElement, TimerPreset } from "./types.ts";
import {
  LOOP_COUNT_MAX,
  LOOP_COUNT_MIN,
  NAME_MAX,
  NAME_MIN,
  PERIOD_TIME_MAX,
  PERIOD_TIME_MIN,
  SEQUENCE_MAX,
  SEQUENCE_MIN,
} from "./constants.ts";

export const TimerElementSchema: z.ZodType<TimerElement> = z.lazy(() =>
  z.discriminatedUnion("kind", [
    TimerPeriodSchema,
    TimerSequenceSchema,
    TimerLoopSchema,
  ])
);

export const TimerPeriodSchema = z.object({
  kind: z.literal("period"),
  name: z.string().min(NAME_MIN).max(NAME_MAX),
  seconds: z.number().min(PERIOD_TIME_MIN).max(PERIOD_TIME_MAX),
});

export const TimerSequenceSchema = z.object({
  kind: z.literal("sequence"),
  elements: z.array(TimerElementSchema).min(SEQUENCE_MIN).max(SEQUENCE_MAX),
});

export const TimerLoopSchema = z.object({
  kind: z.literal("loop"),
  count: z.number().min(LOOP_COUNT_MIN).max(LOOP_COUNT_MAX),
  element: TimerElementSchema,
});

export const TimerPresetSchema: z.ZodType<TimerPreset> = z.object({
  id: z.string().uuid(),
  name: z.string().min(NAME_MIN).max(NAME_MAX),
  root: TimerSequenceSchema,
});
