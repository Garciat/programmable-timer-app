import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  BookCheck,
  Calculator,
  MoveLeft,
  Pencil,
  Timer,
  Trash2,
} from "lucide-react";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { formatSeconds } from "lib/utils/time.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";
import {
  deleteRecord,
  getHistoryRecordById,
  openHistoryDB,
} from "src/app/history/db.ts";
import { HistoryRecord } from "src/app/history/types.ts";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";

import stylesAll from "src/pages/all.module.css";
import styles from "src/pages/history/HistoryRecordPage.module.css";

export function HistoryRecordPage() {
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

  const dateTimeFormat = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  });

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
            <header>Completed</header>
            <p>{dateTimeFormat.format(record.completedAt)}</p>
          </HStack>
          <HStack kind="article">
            <header>Duration</header>
            <p>{formatSeconds(record.presetDuration)}</p>
          </HStack>
        </VStack>
        <VStack grow={1} />
        <HStack kind="footer">
          <IconButton icon={Pencil} href={`/history/record/${recordId}/edit`} />
          <IconButton icon={Trash2} onClick={handleDeleteRecord} />
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
