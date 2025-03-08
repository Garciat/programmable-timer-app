import { useCallback, useEffect, useState } from "react";
import { CalendarX, Trash2, Wrench } from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { deleteHistoryDB } from "src/app/history/db.ts";
import { useAppSettingsReset } from "src/state/utils.ts";

export function AdvancedSection() {
  return (
    <VStack kind="section">
      <HStack kind="header">
        <Wrench />
        <h2>Advanced</h2>
      </HStack>
      <DeleteDataSubsection />
      <ServiceWorkersSubsection />
    </VStack>
  );
}

function DeleteDataSubsection() {
  const reset = useAppSettingsReset();

  const handleResetRequest = useCallback(async () => {
    if (globalThis.confirm("Are you sure you want to delete all data?")) {
      reset();
      await deleteHistoryDB();
      globalThis.alert("All data has been deleted.");
    }
  }, [reset]);

  const handleHistoryResetRequest = useCallback(async () => {
    if (
      globalThis.confirm(
        "Are you sure you want to delete all history data?",
      )
    ) {
      await deleteHistoryDB();
      globalThis.alert("History data has been deleted.");
    }
  }, []);

  return (
    <VStack kind="article">
      <HStack kind="header">
        <h3>Delete Data</h3>
      </HStack>
      <HStack gap="1rem" justify="flex-start">
        <button type="button" onClick={handleResetRequest}>
          <Trash2 />
          <span>Delete All Data</span>
        </button>
        <button type="button" onClick={handleHistoryResetRequest}>
          <CalendarX />
          <span>Delete History Data</span>
        </button>
      </HStack>
    </VStack>
  );
}

function ServiceWorkersSubsection() {
  // Note that these go stale and cannot be relied upon for actions
  const [serviceWorkerRegistrations, setServiceWorkerRegistrations] = useState<
    readonly ServiceWorkerRegistration[]
  >([]);

  useEffect(() => {
    if (!globalThis.navigator.serviceWorker) {
      return;
    }
    globalThis.navigator.serviceWorker.getRegistrations().then(
      (registrations) => {
        setServiceWorkerRegistrations(registrations);
      },
    );
  }, []);

  const unregisterServiceWorkers = useCallback(async () => {
    if (!globalThis.navigator.serviceWorker) {
      alert("Service Workers are not supported in this browser.");
      return;
    }
    const registrations = await globalThis.navigator.serviceWorker
      .getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    alert("Service Workers unregistered. Reloading the page.");
    globalThis.location.reload();
  }, []);

  return (
    <VStack kind="article">
      <HStack kind="header">
        <h3>Service Workers</h3>
      </HStack>
      <HStack gap="1rem" justify="flex-start">
        <button type="button" onClick={unregisterServiceWorkers}>
          Unregister All ({serviceWorkerRegistrations.length})
        </button>
      </HStack>
    </VStack>
  );
}
