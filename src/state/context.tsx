import { createContext, useContext, useMemo, useReducer } from "react";

import {
  Action,
  AppState,
  PlayerSession,
  UserSettings,
} from "src/state/types.ts";
import { DEFAULT_APP_STATE } from "src/state/default.ts";
import { TimerPreset } from "src/app/types.ts";

interface AppStateContextType {
  state: AppState;
  dispatch: (action: Action) => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateContextProvider(
  { children }: { children: React.ReactNode },
) {
  const [state, dispatch] = useAppStateReducer();
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

function useAppStateCore(): [AppState, (action: Action) => void] {
  const context = useContext(AppStateContext);
  if (context === null) {
    throw new Error(
      "useAppState must be used within a AppStateContextProvider",
    );
  }
  return [context.state, context.dispatch];
}

export function useAppState(): [AppState, (state: AppState) => void] {
  const [state, dispatch] = useAppStateCore();

  const setter = useMemo(() => {
    return (state: AppState) => {
      dispatch({ type: "loadState", state });
    };
  }, [dispatch]);

  return [state, setter];
}

export function useAppPlayerSession(): [
  PlayerSession | undefined,
  {
    update: (playerSession: PlayerSession) => void;
    clear: () => void;
  },
] {
  const [state, dispatch] = useAppStateCore();

  const setter = useMemo(() => ({
    update: (playerSession: PlayerSession) => {
      dispatch({ type: "updatePlayerSession", playerSession });
    },
    clear: () => {
      dispatch({ type: "clearPlayerSession" });
    },
  }), [dispatch]);

  return [state.playerSession, setter];
}

export function useAppPresets(): TimerPreset[] {
  const [state] = useAppStateCore();
  return state.presets;
}

export function useAppPreset(
  id: string,
): [TimerPreset | undefined, (preset: TimerPreset) => void] {
  const [state, dispatch] = useAppStateCore();

  const preset = useMemo(() => {
    return state.presets.find((preset) => preset.id === id);
  }, [state.presets, id]);

  const setter = useMemo(() => {
    return (updated: TimerPreset) => {
      dispatch({ type: "updatePreset", preset: updated });
    };
  }, [dispatch]);

  return [preset, setter];
}

export function useAppPresetAdd(): (preset: Omit<TimerPreset, "id">) => void {
  const [, dispatch] = useAppStateCore();

  const adder = useMemo(() => {
    return (preset: Omit<TimerPreset, "id">) => {
      dispatch({ type: "addPreset", preset });
    };
  }, [dispatch]);

  return adder;
}

export function useAppPresetDelete(): (id: string) => void {
  const [, dispatch] = useAppStateCore();

  const deleter = useMemo(() => {
    return (id: string) => {
      dispatch({ type: "deletePreset", id });
    };
  }, [dispatch]);

  return deleter;
}

export function useAppSettings(): [
  UserSettings,
  (updater: (settings: UserSettings) => UserSettings) => void,
] {
  const [state, dispatch] = useAppStateCore();

  const setter = useMemo(() => {
    return (updater: (settings: UserSettings) => UserSettings) => {
      dispatch({ type: "updateSettings", updater });
    };
  }, [dispatch]);

  return [state.settings, setter];
}

function useAppStateReducer(): [AppState, (action: Action) => void] {
  const [state, dispatch] = useReducer(appStateReducer, DEFAULT_APP_STATE);
  return [state, dispatch];
}

function appStateReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "loadState":
      return action.state;
    case "addPreset":
      return {
        ...state,
        presets: [...state.presets, {
          ...action.preset,
          id: crypto.randomUUID(),
        }],
        version: state.version + 1,
      };
    case "updatePreset":
      return {
        ...state,
        presets: state.presets.map((preset) =>
          preset.id === action.preset.id ? action.preset : preset
        ),
        version: state.version + 1,
      };
    case "deletePreset":
      return {
        ...state,
        presets: state.presets.filter((preset) => preset.id !== action.id),
        version: state.version + 1,
      };
    case "updateSettings":
      return {
        ...state,
        settings: action.updater(state.settings),
        version: state.version + 1,
      };
    case "updatePlayerSession":
      return {
        ...state,
        playerSession: action.playerSession,
        version: state.version + 1,
      };
    case "clearPlayerSession":
      return {
        ...state,
        playerSession: undefined,
        version: state.version + 1,
      };
    default:
      action satisfies never;
      return state;
  }
}
