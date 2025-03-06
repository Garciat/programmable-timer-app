import { useEffect, useMemo, useState } from "react";
import {
  BookCheck,
  BookX,
  Calculator,
  Clock3,
  Hourglass,
  Menu,
  Timer,
} from "lucide-react";
import { DateTime } from "luxon";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { HistoryRecord } from "src/app/history/types.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { MainNav } from "src/components/MainNav.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";
import { getAllRecordsByDateAsc, openHistoryDB } from "src/app/history/db.ts";
import { formatSeconds } from "lib/utils/time.ts";

export function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const db = await openHistoryDB();
      const allRecords = await getAllRecordsByDateAsc(db);
      setRecords(allRecords);
    };

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

      console.log(date);

      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(record);
    }

    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [records]);

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
        alignItems="stretch"
        justify="flex-start"
        gap="2rem"
        className={stylesAll["content-frame"]}
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
          <VStack
            key={date}
            alignItems="stretch"
            justify="flex-start"
            gap="0.5rem"
          >
            <HStack justify="flex-start" gap="1rem">
              <span style={{ opacity: "0.6" }}>
                {dateFormat.format(Date.parse(date))}
              </span>
            </HStack>
            {records.map((record) => (
              <HStack justify="flex-start" gap="1rem">
                <HStack gap="0.5rem">
                  <Clock3 size="1rem" />
                  <span>{timeFormat.format(record.completedAt)}</span>
                </HStack>
                <HStack gap="0.5rem">
                  <Hourglass size="1rem" />
                  <span>{formatSeconds(record.presetDuration)}</span>
                </HStack>
                <HStack gap="0.5rem">
                  <BookCheck
                    size="1rem"
                    style={{ color: "var(--accent-color)" }}
                  />
                  <span>{record.presetName}</span>
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
