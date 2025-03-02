import { useEffect, useState } from "react";

import { useAppState } from "../state/context.tsx";
import { AppState } from "../state/types.ts";

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

  return null;
}

function loadState() {
  const serializedState = localStorage.getItem(STORAGE_KEY);
  if (serializedState === null) {
    return undefined;
  }
  return JSON.parse(serializedState) as AppState;
}

function saveState(state: AppState) {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, serializedState);
}
