import { z } from "zod";
import {
  HistoryExportV1,
  HistoryRecordExportV1,
} from "src/app/history/types.ts";

export const HistoryRecordExportSchemaV1 = z.object({
  presetId: z.string().uuid(),
  presetName: z.string(),
  presetDuration: z.number(),
  completedAt: z.coerce.date(),
  tags: z.array(z.string()),
  data: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    }),
  ),
  presetSnapshot: z.string(),
});

({} as z.infer<
  typeof HistoryRecordExportSchemaV1
>) satisfies HistoryRecordExportV1;

export const HistoryExportSchemaV1 = z.object({
  version: z.literal(1),
  records: z.array(HistoryRecordExportSchemaV1),
  exportedAt: z.coerce.date(),
});

({} as z.infer<typeof HistoryExportSchemaV1>) satisfies HistoryExportV1;
