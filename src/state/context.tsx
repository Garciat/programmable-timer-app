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

// TODO: temporary
export function useAppPreset(): [TimerPreset, (preset: TimerPreset) => void] {
  const [state, dispatch] = useAppState();

  const setter = useMemo(() => {
    return (preset: TimerPreset) => {
      dispatch({ type: "setPreset", preset });
    };
  }, [dispatch]);

  return [state.preset, setter];
}

function useAppStateReducer(): [AppState, (action: Action) => void] {
  const [state, dispatch] = useReducer(appStateReducer, DEFAULT_APP_STATE);
  return [state, dispatch];
}

function appStateReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "setPreset":
      return { ...state, preset: action.preset };
    default:
      return state;
  }
}
