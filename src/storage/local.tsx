import { useEffect, useState } from "react";

import { useAppState } from "../state/context.tsx";
import { AppState } from "../state/types.ts";
import { AppStateSchema } from "../state/schema.ts";

const STORAGE_KEY = "programmable-timer-app-state";

export function AppStateLocalStorage() {
  const [state, setState] = useAppState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedState = loadState();
    if (savedState !== undefined) {
      console.log("Loaded state from local storage");
      setState(savedState);
    }
    setReady(true);
  }, [setState]);

  useEffect(() => {
    if (ready) {
      console.log("Saved state to local storage");
      saveState(state);
    }
  }, [state, ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    function listener(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        const state = readStateValue(event.newValue);
        if (state !== undefined) {
          console.log("Received state from local storage");
          setState(state);
        }
      }
    }

    console.log("Listening for storage events");

    globalThis.addEventListener("storage", listener);

    return () => {
      globalThis.removeEventListener("storage", listener);
    };
  }, [ready, setState]);

  return null;
}

function loadState() {
  const serializedState = localStorage.getItem(STORAGE_KEY);
  return readStateValue(serializedState);
}

function readStateValue(value: string | null): AppState | undefined {
  try {
    return AppStateSchema.parse(JSON.parse(value ?? ""));
  } catch (e) {
    console.error("Failed to load state from local storage", e);
    console.log("Clearing local storage");
    localStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}

function saveState(state: AppState) {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, serializedState);
}
