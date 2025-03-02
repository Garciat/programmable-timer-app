import { createContext, useContext, useMemo, useReducer } from "react";
import { Action, AppState } from "./types.ts";
import { DEFAULT_APP_STATE } from "./default.ts";
import { TimerPreset } from "../app/types.ts";

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

function useAppState(): [AppState, (action: Action) => void] {
  const context = useContext(AppStateContext);
  if (context === null) {
    throw new Error(
      "useAppState must be used within a AppStateContextProvider",
    );
  }
  return [context.state, context.dispatch];
}

export function useAppPresets(): TimerPreset[] {
  const [state] = useAppState();
  return state.presets;
}

export function useAppPreset(
  id: string,
): [TimerPreset | undefined, (preset: TimerPreset) => void] {
  const [state, dispatch] = useAppState();

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
  const [, dispatch] = useAppState();

  const adder = useMemo(() => {
    return (preset: Omit<TimerPreset, "id">) => {
      dispatch({ type: "addPreset", preset });
    };
  }, [dispatch]);

  return adder;
}

export function useAppPresetDelete(): (id: string) => void {
  const [, dispatch] = useAppState();

  const deleter = useMemo(() => {
    return (id: string) => {
      dispatch({ type: "deletePreset", id });
    };
  }, [dispatch]);

  return deleter;
}

function useAppStateReducer(): [AppState, (action: Action) => void] {
  const [state, dispatch] = useReducer(appStateReducer, DEFAULT_APP_STATE);
  return [state, dispatch];
}

function appStateReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "addPreset":
      return {
        ...state,
        presets: [...state.presets, {
          ...action.preset,
          id: crypto.randomUUID(),
        }],
      };
    case "updatePreset":
      return {
        ...state,
        presets: state.presets.map((preset) =>
          preset.id === action.preset.id ? action.preset : preset
        ),
      };
    case "deletePreset":
      return {
        ...state,
        presets: state.presets.filter((preset) => preset.id !== action.id),
      };
    default:
      action satisfies never;
      return state;
  }
}
