import { DBSchema, IDBPDatabase, openDB } from "idb";

import { HistoryRecord } from "src/app/history/types.ts";

const DB_NAME = "history";
const DB_VERSION = 1;

interface HistoryDB_V1 extends DBSchema {
  records: {
    value: {
      recordId: string; // UUID
      presetId: string; // UUID
      presetName: string;
      presetDuration: number; // seconds
      completedAt: Date; // UTC
      tags: string[];
      data: Record<string, unknown>;
      presetSnapshot: string;
    };
    key: string;
    indexes: {
      "by-presetId": string;
      "by-completedAt": Date;
      "by-tags": string;
    };
  };
}

export type Conn = IDBPDatabase<HistoryDB_V1>;

export async function openHistoryDB(): Promise<Conn> {
  const conn = await openDB<HistoryDB_V1>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const recordsStore = db.createObjectStore("records", {
          keyPath: "recordId",
        });
        recordsStore.createIndex("by-presetId", "presetId");
        recordsStore.createIndex("by-completedAt", "completedAt");
        recordsStore.createIndex("by-tags", "tags", { multiEntry: true });
      }
    },
  });

  return conn;
}

export async function saveHistoryRecord(
  db: Conn,
  record: Omit<HistoryRecord, "recordId">,
): Promise<void> {
  const recordId = crypto.randomUUID();

  await db.add("records", {
    recordId,
    presetId: record.presetId,
    presetName: record.presetName,
    presetDuration: record.presetDuration,
    completedAt: record.completedAt,
    tags: record.tags,
    data: record.data,
    presetSnapshot: record.presetSnapshot,
  });
}

export async function getAllRecordsByDateAsc(
  db: Conn,
): Promise<HistoryRecord[]> {
  return await db.getAllFromIndex("records", "by-completedAt");
}
