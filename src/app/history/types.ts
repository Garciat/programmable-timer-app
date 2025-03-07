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
