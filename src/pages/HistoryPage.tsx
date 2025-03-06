import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookCheck,
  BookX,
  Calculator,
  Clock3,
  Menu,
  Timer,
  Trash2,
} from "lucide-react";
import { DateTime } from "luxon";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import {
  deleteRecord,
  getAllRecordsByDateAsc,
  openHistoryDB,
} from "src/app/history/db.ts";
import { HistoryRecord } from "src/app/history/types.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { MainNav } from "src/components/MainNav.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";
import styles from "src/pages/HistoryPage.module.css";

export function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  const fetchRecords = async () => {
    const db = await openHistoryDB();
    const allRecords = await getAllRecordsByDateAsc(db);
    setRecords(allRecords);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const recordsByDateDesc = useMemo(() => {
    const map = new Map<string, HistoryRecord[]>();

    for (const record of records) {
      const dt = DateTime.fromJSDate(record.completedAt);
      if (dt.isValid === false) {
        continue;
      }

      const date = dt.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }).toISO();

      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(record);
    }

    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [records]);

  const handleDeleteRecord = useCallback(async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }
    const db = await openHistoryDB();
    await deleteRecord(db, recordId);
    await fetchRecords();
  }, []);

  const dateFormat = new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeFormat = new Intl.DateTimeFormat(navigator.language, {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  return (
    <BaseLayout title="History">
      <TitleBar
        left={
          <IconButton
            icon={Menu}
            href="/settings"
            transitions={["from-left"]}
          />
        }
        middle={
          <>
            <Calculator size={24} />
            <Timer size={24} />
          </>
        }
      />
      <VFrame
        className={`${stylesAll["content-frame"]} ${styles["history-frame"]}`}
      >
        {records.length === 0 && (
          <HStack gap="1rem">
            <BookX />{" "}
            <span>
              You haven't saved any preset completions yet. Get working!
            </span>
          </HStack>
        )}

        {recordsByDateDesc.map(([date, records]) => (
          <VStack key={date} kind="section">
            <HStack kind="header">
              <span style={{ opacity: "0.6" }}>
                {dateFormat.format(Date.parse(date))}
              </span>
            </HStack>
            {records.map((record) => (
              <HStack
                key={record.recordId}
                kind="article"
                justify="flex-start"
                gap="1rem"
              >
                <HStack className={styles["record-time"]}>
                  <Clock3 size="1rem" />
                  <span>{timeFormat.format(record.completedAt)}</span>
                </HStack>
                <HStack>
                  <BookCheck
                    size="1rem"
                    style={{ color: "var(--accent-color)" }}
                  />
                  <span>{record.presetName}</span>
                </HStack>
                <HStack grow={1} />
                <HStack>
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(record.recordId)}
                    className={styles["delete-button"]}
                  >
                    <Trash2 size="0.5rem" />
                  </button>
                </HStack>
              </HStack>
            ))}
          </VStack>
        ))}
      </VFrame>
      <MainNav />
    </BaseLayout>
  );
}
