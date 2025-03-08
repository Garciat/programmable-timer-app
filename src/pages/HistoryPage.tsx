import { useCallback, useEffect, useMemo, useState } from "react";
import { BookCheck, Calculator, Clock3, Hourglass, Timer } from "lucide-react";
import { DateTime } from "luxon";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { formatSeconds } from "lib/utils/time.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";
import { getAllRecordsByDateAsc, openHistoryDB } from "src/app/history/db.ts";
import { HistoryRecord } from "src/app/history/types.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { MainNav } from "src/components/MainNav.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";
import styles from "src/pages/HistoryPage.module.css";

export function HistoryPage() {
  const navigate = useNavigateTransition();
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  const fetchRecords = async () => {
    const db = await openHistoryDB();
    const allRecords = await getAllRecordsByDateAsc(db);
    allRecords.reverse(); // Descending order
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

  const openRecordView = useCallback((record: HistoryRecord) => {
    navigate(`/history/record/${record.recordId}`, ["from-right"]);
  }, [navigate]);

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
          <HStack gap="1rem" style={{ textAlign: "center" }}>
            <p>You haven't saved any preset completions yet. Get working!</p>
          </HStack>
        )}

        {recordsByDateDesc.map(([date, records]) => (
          <VStack key={date} kind="section">
            <HStack kind="header">
              <h2>{dateFormat.format(Date.parse(date))}</h2>
            </HStack>
            {records.map((record) => (
              <HStack
                key={record.recordId}
                kind="article"
                onClick={() => openRecordView(record)}
              >
                <HStack kind="aside" className={styles["record-icon"]}>
                  <BookCheck />
                </HStack>
                <VStack className={styles["record-body"]}>
                  <HStack kind="header">
                    <h3>{record.presetName}</h3>
                  </HStack>
                  <HStack kind="footer">
                    <HStack>
                      <Hourglass size="0.8rem" />
                      <span>{formatSeconds(record.presetDuration)}</span>
                    </HStack>
                    {record.data.map(({ key, value }, index) => (
                      <HStack
                        key={index}
                        className={styles["record-data-item"]}
                      >
                        <span>{key}</span>
                        <span>:&nbsp;</span>
                        <span>{value}</span>
                      </HStack>
                    ))}
                  </HStack>
                </VStack>
                <VStack kind="aside" className={styles["record-trailer"]}>
                  <HStack className={styles["record-time"]}>
                    <Clock3 size="0.8rem" />
                    <span>{timeFormat.format(record.completedAt)}</span>
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </VStack>
        ))}
      </VFrame>
      <MainNav />
    </BaseLayout>
  );
}
