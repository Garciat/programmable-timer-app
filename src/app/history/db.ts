import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb";

import { HistoryExportV1, HistoryRecord } from "src/app/history/types.ts";
import { HistoryExportSchemaV1 } from "src/app/history/schema.ts";

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
      data: Array<{ key: string; value: string }>;
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
): Promise<string> {
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

  return recordId;
}

export async function getHistoryRecordById(
  db: Conn,
  recordId: string,
): Promise<HistoryRecord | undefined> {
  return await db.get("records", recordId);
}

export async function getNewestRecordByPresetId(
  db: Conn,
  presetId: string,
  reference: Date,
): Promise<HistoryRecord | undefined> {
  const records = await db.getAllFromIndex(
    "records",
    "by-presetId",
    presetId,
  );
  // inefficient, but good enough for now
  const previous = records
    .toSorted((a, b) => a.completedAt.getTime() - b.completedAt.getTime())
    .findLast((r) => r.completedAt < reference);
  return previous;
}

export async function updateHistoryRecord(
  db: Conn,
  record: HistoryRecord,
): Promise<void> {
  await db.put("records", {
    recordId: record.recordId,
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

export async function deleteRecord(db: Conn, recordId: string): Promise<void> {
  await db.delete("records", recordId);
}

export async function deleteHistoryDB(): Promise<void> {
  await deleteDB(DB_NAME);
}

export async function isHistoryRecordsEmpty(): Promise<boolean> {
  const db = await openHistoryDB();
  try {
    return (await db.count("records")) === 0;
  } finally {
    db.close();
  }
}

export async function exportHistoryToJSON(): Promise<string> {
  const data = await exportAllHistoryData();
  return JSON.stringify(data);
}

export async function importHistoryFromJSON(input: string): Promise<void> {
  const json = JSON.parse(input);
  const data = HistoryExportSchemaV1.parse(json);
  await importAllHistoryData(data);
}

async function exportAllHistoryData(): Promise<HistoryExportV1> {
  const db = await openHistoryDB();
  try {
    const records = await db.getAll("records");

    const exportedRecords = records.map((record) => ({
      ...record,
      recordId: undefined,
    }));

    return {
      version: DB_VERSION,
      records: exportedRecords,
      exportedAt: new Date(),
    };
  } finally {
    db.close();
  }
}

// @throws
async function importAllHistoryData(data: HistoryExportV1): Promise<void> {
  const db = await openHistoryDB();
  try {
    for (const record of data.records) {
      await saveHistoryRecord(db, record);
    }
  } finally {
    db.close();
  }
}
