export interface HistoryRecord {
  recordId: string;
  presetId: string;
  presetName: string;
  presetDuration: number;
  completedAt: Date;
  tags: string[];
  data: HistoryRecordDataItem[];
  presetSnapshot: string;
}

export interface HistoryRecordDataItem {
  key: string;
  value: string;
}

export interface HistoryExportV1 {
  version: 1;
  records: HistoryRecordExportV1[];
  exportedAt: Date;
}

export type HistoryRecordExportV1 = Omit<HistoryRecord, "recordId">;
