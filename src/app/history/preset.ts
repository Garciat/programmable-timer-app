import { DateTime } from "luxon";

import { duration } from "src/app/flatten.ts";
import { TimerPreset } from "src/app/types.ts";
import {
  getNewestRecordByPresetId,
  openHistoryDB,
  saveHistoryRecord,
} from "src/app/history/db.ts";

export function snapshotPreset(preset: TimerPreset): string {
  return JSON.stringify(preset);
}

export async function createHistoryRecord(
  preset: TimerPreset,
): Promise<string> {
  const db = await openHistoryDB();
  try {
    const previous = await getNewestRecordByPresetId(
      db,
      preset.id,
      DateTime.utc().toJSDate(),
    );
    return await saveHistoryRecord(db, {
      presetId: preset.id,
      presetName: preset.name,
      presetDuration: duration(preset.root),
      completedAt: DateTime.utc().toJSDate(),
      tags: [],
      data: previous ? previous.data : [],
      presetSnapshot: snapshotPreset(preset),
    });
  } finally {
    db.close();
  }
}
