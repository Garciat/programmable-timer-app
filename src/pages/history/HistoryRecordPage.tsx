import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  BookCheck,
  Calculator,
  Copy,
  MoveLeft,
  Pencil,
  Plus,
  Save,
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

import stylesAll from "src/pages/all.module.css";
import styles from "src/pages/history/HistoryRecordPage.module.css";

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
    await navigate("/history");
  }, [record, navigate]);

  const handleSave = useCallback(async () => {
    if (!record) {
      return;
    }
    const db = await openHistoryDB();
    await updateHistoryRecord(db, record);
    await navigate(`/history/record/${record.recordId}`);
  }, [record]);

  const handleCancel = useCallback(() => {
    navigate(`/history/record/${recordId}`);
  }, []);

  const copyDataItems = useCallback(async () => {
    if (!record) {
      return;
    }
    if (!confirm("Do you want to copy all data from the previous record?")) {
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
    setRecord({
      ...record,
      data: [...record.data, ...previous.data],
    });
  }, [record]);

  const insertDataItem = useCallback(() => {
    if (!record) {
      return;
    }
    setRecord({
      ...record,
      data: [...record.data, { key: "Key", value: "Value" }],
    });
  }, [record]);

  const updateDataItem = useCallback(
    (index: number, field: keyof HistoryRecordDataItem, value: string) => {
      if (!record) {
        return;
      }
      setRecord({
        ...record,
        data: record.data.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      });
    },
    [record],
  );

  const deleteDataItem = useCallback((index: number) => {
    if (!record) {
      return;
    }
    setRecord({
      ...record,
      data: record.data.filter((_, i) => i !== index),
    });
  }, [record]);

  const setDateTimes = useCallback((value: string) => {
    if (!record) {
      return;
    }
    setRecord({
      ...record,
      completedAt: DateTime.fromISO(value).toUTC().toJSDate(),
    });
  }, [record]);

  const dateTimeFormat = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  });

  const dateLocalISO = record &&
    DateTime.fromJSDate(record.completedAt).toLocal().toISO()?.slice(0, 16);

  const DataItemView = (props: { item: HistoryRecordDataItem }) => (
    <HStack kind="article">
      <HStack kind="header">
        <p>{props.item.key}</p>
      </HStack>
      <HStack gap="0.5rem">
        <p>{props.item.value}</p>
      </HStack>
    </HStack>
  );

  const DataItemEditor = (
    props: { item: HistoryRecordDataItem; index: number },
  ) => (
    <HStack kind="article">
      <HStack kind="header" className={styles["editing"]}>
        <input
          type="text"
          value={props.item.key}
          onChange={(e) => updateDataItem(props.index, "key", e.target.value)}
        />
      </HStack>
      <HStack gap="0.5rem">
        <input
          type="text"
          value={props.item.value}
          onChange={(e) => updateDataItem(props.index, "value", e.target.value)}
        />
        <IconButton
          icon={Trash2}
          onClick={() => deleteDataItem(props.index)}
        />
      </HStack>
    </HStack>
  );

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
      <VStack className={styles["record-details"]}>
        <VStack kind="section">
          <h2>Details</h2>
          <HStack kind="article">
            <HStack kind="header">
              <p>Completed</p>
            </HStack>
            <p>
              {editing
                ? (
                  <input
                    type="datetime-local"
                    value={dateLocalISO}
                    onChange={(e) => setDateTimes(e.target.value)}
                  />
                )
                : dateTimeFormat.format(record.completedAt)}
            </p>
          </HStack>
          <HStack kind="article">
            <HStack kind="header">
              <p>Duration</p>
            </HStack>
            <p>{formatSeconds(record.presetDuration)}</p>
          </HStack>
        </VStack>
        <VStack kind="section">
          <HStack kind="header">
            <h2>Data</h2>
            {editing && (
              <HStack kind="aside" gap="0.5rem">
                <IconButton icon={Copy} onClick={copyDataItems} />
                <IconButton icon={Plus} onClick={insertDataItem} />
              </HStack>
            )}
          </HStack>
          {!editing && record.data.length === 0 && (
            <p>No data associated with this record.</p>
          )}
          {record.data.map((item, index) => (
            editing
              ? <DataItemEditor key={index} item={item} index={index} />
              : <DataItemView key={index} item={item} />
          ))}
        </VStack>
        <VStack grow={1} />
        <HStack kind="footer">
          <IconButton icon={Trash2} onClick={handleDeleteRecord} />
          {editing && <IconButton icon={Save} onClick={handleSave} />}
        </HStack>
      </VStack>
    </>
  );

  return (
    <BaseLayout title="History">
      <TitleBar
        left={
          <IconButton
            icon={MoveLeft}
            href="/history"
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
            <IconButton
              icon={Pencil}
              href={`/history/record/${recordId}/edit`}
            />
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
