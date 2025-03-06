export interface HistoryRecord {
  recordId: string;
  presetId: string;
  presetName: string;
  presetDuration: number;
  completedAt: Date;
  tags: string[];
  data: Record<string, unknown>;
  presetSnapshot: string;
}
