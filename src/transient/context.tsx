import { createContext, useContext, useState } from "react";

import { TransientState } from "src/transient/types.ts";
import { DEFAULT_TRANSIENT_STATE } from "src/transient/default.ts";

interface TransientStateContextType {
  state: TransientState;
  setState: (updater: (state: TransientState) => TransientState) => void;
}

const TransientStateContext = createContext<TransientStateContextType | null>(
  null,
);

export function TransientStateProvider(
  { children }: { children: React.ReactNode },
) {
  const [state, setState] = useState<TransientState>(DEFAULT_TRANSIENT_STATE);

  return (
    <TransientStateContext.Provider value={{ state, setState }}>
      {children}
    </TransientStateContext.Provider>
  );
}

export function useTransientState() {
  const context = useContext(TransientStateContext);
  if (!context) {
    throw new Error(
      "useTransientState must be used within a TransientStateProvider",
    );
  }
  return [context.state, context.setState] as const;
}
