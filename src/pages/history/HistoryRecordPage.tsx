import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  BookCheck,
  Calculator,
  EllipsisVertical,
  MoveLeft,
  Plus,
  Save,
  Settings,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { DateTime } from "luxon";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { formatSeconds } from "lib/utils/time.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";
import {
  deleteRecord,
  getHistoryRecordById,
  getNewestRecordByPresetId,
  openHistoryDB,
  updateHistoryRecord,
} from "src/app/history/db.ts";
import { HistoryRecord, HistoryRecordDataItem } from "src/app/history/types.ts";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import {
  routeHistory,
  routeHistoryRecord,
  routeHistoryRecordEdit,
} from "src/routes.ts";

import stylesAll from "src/pages/all.module.css";
import styles from "src/pages/history/HistoryRecordPage.module.css";
import { IconMenu } from "src/components/IconMenu.tsx";

export interface HistoryRecordPageProps {
  editing?: boolean;
}

export function HistoryRecordPage({ editing }: HistoryRecordPageProps) {
  const navigate = useNavigateTransition();
  const { recordId } = useParams();
  const [record, setRecord] = useState<HistoryRecord>();

  useEffect(() => {
    if (!recordId) {
      return;
    }
    const load = async () => {
      const db = await openHistoryDB();
      const record = await getHistoryRecordById(db, recordId);
      setRecord(record);
    };
    load();
  }, [recordId]);

  const handleDeleteRecord = useCallback(async () => {
    if (!record) {
      return;
    }
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }
    const db = await openHistoryDB();
    await deleteRecord(db, record.recordId);
    await navigate(routeHistory());
  }, [record, navigate]);

  const handleEdit = useCallback(() => {
    if (!record) {
      return;
    }
    navigate(routeHistoryRecordEdit(record.recordId));
  }, [record]);

  const handleSave = useCallback(async () => {
    if (!record) {
      return;
    }
    const db = await openHistoryDB();
    await updateHistoryRecord(db, record);
    await navigate(routeHistoryRecord(record.recordId));
  }, [record]);

  const handleCancel = useCallback(() => {
    if (!record) {
      return;
    }
    navigate(routeHistoryRecord(record.recordId));
  }, [record]);

  const historyRecordView = record && (
    <>
      <VStack />
      <VStack kind="header">
        <HStack className={styles["leading-icon"]}>
          <BookCheck />
        </HStack>
        <small>Completed</small>
        <h1>{record.presetName}</h1>
      </VStack>
      {editing
        ? (
          <HistoryRecordEditor
            record={record}
            onChange={setRecord}
            onSave={handleSave}
          />
        )
        : <HistoryRecordView record={record} />}
    </>
  );

  return (
    <BaseLayout title="History">
      <TitleBar
        left={
          <IconButton
            icon={MoveLeft}
            href={routeHistory()}
            transitions={["from-right-backwards"]}
          />
        }
        middle={
          <>
            <Calculator size="1.5rem" />
            <Timer size="1.5rem" />
          </>
        }
        right={editing
          ? <IconButton icon={X} onClick={handleCancel} />
          : (
            <IconMenu icon={EllipsisVertical} title="Record options">
              {{ label: "Edit", onSelect: handleEdit }}
              {{ label: "Delete", onSelect: handleDeleteRecord }}
            </IconMenu>
          )}
      />
      <VFrame
        className={`${stylesAll["content-frame"]} ${
          styles["history-record-frame"]
        }`}
      >
        {historyRecordView}
      </VFrame>
    </BaseLayout>
  );
}

function HistoryRecordView({ record }: { record: HistoryRecord }) {
  const dateTimeFormat = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  });

  return (
    <VStack className={styles["record-details"]}>
      <VStack kind="section">
        <h2>Details</h2>
        <HStack kind="article">
          <HStack kind="header">
            <p>Completed</p>
          </HStack>
          <p>{dateTimeFormat.format(record.completedAt)}</p>
        </HStack>
        <HStack kind="article">
          <HStack kind="header">
            <p>Duration</p>
          </HStack>
          <p>{formatSeconds(record.presetDuration)}</p>
        </HStack>
      </VStack>
      <HistoryRecordDataView record={record} />
    </VStack>
  );
}

interface HistoryRecordEditorProps {
  record: HistoryRecord;
  onChange: (record: HistoryRecord) => void;
  onSave: () => void;
}

function HistoryRecordEditor(
  { record, onChange, onSave }: HistoryRecordEditorProps,
) {
  const setUpdatedAt = useCallback((value: string) => {
    if (!record) {
      return;
    }
    onChange({
      ...record,
      completedAt: DateTime.fromISO(value).toUTC().toJSDate(),
    });
  }, [record]);

  const dateLocalISO = record &&
    DateTime.fromJSDate(record.completedAt).toLocal().toISO()?.slice(0, 16);

  return (
    <VStack className={styles["record-details"]}>
      <VStack kind="section">
        <h2>Details</h2>
        <HStack kind="article">
          <HStack kind="header">
            <p>Completed</p>
          </HStack>
          <p>
            <input
              type="datetime-local"
              value={dateLocalISO}
              onChange={(e) => setUpdatedAt(e.target.value)}
            />
          </p>
        </HStack>
        <HStack kind="article">
          <HStack kind="header">
            <p>Duration</p>
          </HStack>
          <p>{formatSeconds(record.presetDuration)}</p>
        </HStack>
      </VStack>
      <HistoryRecordDataEditor
        record={record}
        onChange={onChange}
      />
      <VStack grow={1} />
      <HStack kind="footer">
        <HStack grow={1} />
        <button type="button" onClick={onSave} className="primary">
          <Save />
          <span>Save</span>
        </button>
      </HStack>
    </VStack>
  );
}

function HistoryRecordDataView({ record }: { record: HistoryRecord }) {
  return (
    <VStack kind="section">
      <HStack kind="header">
        <h2>Data</h2>
      </HStack>
      {record.data.length === 0 && <p>No data associated with this record.</p>}
      {record.data.map((item, index) => (
        <HStack key={index} kind="article">
          <HStack kind="header">
            <p>{item.key}</p>
          </HStack>
          <HStack gap="0.5rem">
            <p>{item.value}</p>
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
}

interface HistoryRecordDataEditorProps {
  record: HistoryRecord;
  onChange: (record: HistoryRecord) => void;
}

function HistoryRecordDataEditor(
  { record, onChange }: HistoryRecordDataEditorProps,
) {
  const copyDataItems = useCallback(async () => {
    if (!record) {
      return;
    }
    const db = await openHistoryDB();
    const previous = await getNewestRecordByPresetId(
      db,
      record.presetId,
      record.completedAt,
    );
    if (!previous) {
      return alert("No previous record found for this preset.");
    }
    onChange({
      ...record,
      data: [...record.data, ...previous.data],
    });
  }, [record]);

  const insertDataItem = useCallback(() => {
    if (!record) {
      return;
    }
    onChange({
      ...record,
      data: [...record.data, { key: "Key", value: "Value" }],
    });
  }, [record]);

  const updateDataItem = useCallback(
    (index: number, field: keyof HistoryRecordDataItem, value: string) => {
      if (!record) {
        return;
      }
      const item = record.data[index];
      const newItem = { ...item, [field]: value };
      const items = [...record.data];
      items[index] = newItem;
      onChange({
        ...record,
        data: items,
      });
    },
    [record],
  );

  const deleteDataItem = useCallback((index: number) => {
    if (!record) {
      return;
    }
    onChange({
      ...record,
      data: record.data.filter((_, i) => i !== index),
    });
  }, [record]);

  return (
    <VStack kind="section">
      <HStack kind="header">
        <h2>Data</h2>
        <HStack kind="aside" gap="0.5rem">
          <IconMenu icon={Settings} title="Data options">
            {{ label: "Copy from previous record", onSelect: copyDataItems }}
          </IconMenu>
          <IconButton icon={Plus} onClick={insertDataItem} />
        </HStack>
      </HStack>
      {record.data.map((item, index) => (
        <HStack key={index} kind="article">
          <HStack kind="header" className={styles["editing"]}>
            <input
              type="text"
              value={item.key}
              onChange={(e) => updateDataItem(index, "key", e.target.value)}
            />
          </HStack>
          <HStack gap="0.5rem">
            <input
              type="text"
              value={item.value}
              onChange={(e) => updateDataItem(index, "value", e.target.value)}
            />
            <IconButton
              icon={Trash2}
              onClick={() => deleteDataItem(index)}
            />
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
}
