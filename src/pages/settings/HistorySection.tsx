import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  FileInput,
  FileOutput,
  TriangleAlert,
} from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { readFileToString } from "lib/utils/file.ts";
import {
  exportHistoryToJSON,
  importHistoryFromJSON,
  isHistoryRecordsEmpty,
} from "src/app/history/db.ts";

export function HistorySection() {
  const [message, setMessage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isHistoryRecordsEmpty().then((isEmpty) => {
      if (!isEmpty) {
        setMessage(
          "Your history is not empty. Importing may duplicate your current history.",
        );
      }
    });
  }, []);

  const handleExportJSON = useCallback(async () => {
    const json = await exportHistoryToJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportJSON = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }

      try {
        const text = await readFileToString(files[0]);
        await importHistoryFromJSON(text);
        alert("Imported history from JSON successfully.");
      } catch (error) {
        console.error(error);
        alert(`Failed to import history from JSON.`);
      }
    },
    [],
  );

  return (
    <VStack kind="section">
      <HStack kind="header">
        <CalendarCheck />
        <h2>History</h2>
      </HStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Export / Import</h3>
        </HStack>
        {message && (
          <HStack gap="0.5rem">
            <TriangleAlert />
            <small>{message}</small>
          </HStack>
        )}
        <HStack justify="flex-start" gap="0.5rem" wrap="wrap">
          <button type="button" onClick={handleExportJSON}>
            <FileOutput />
            <span>Export JSON</span>
          </button>
          <label>
            <FileInput />
            <span>Import JSON</span>
            <input
              ref={fileInput}
              type="file"
              accept=".json"
              onChange={(e) => handleImportJSON(e.target.files)}
            />
          </label>
        </HStack>
      </VStack>
    </VStack>
  );
}
