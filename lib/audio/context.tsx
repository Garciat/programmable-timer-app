import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

const ReactAudioContext = createContext<AudioContext | null>(null);

export interface ReactAudioContextProviderProps {
  children: React.ReactNode;
}

export function ReactAudioContextProvider(
  { children }: ReactAudioContextProviderProps,
) {
  const audioContext = new AudioContext();
  return (
    <ReactAudioContext.Provider value={audioContext}>
      {children}
    </ReactAudioContext.Provider>
  );
}

export function useAudioContext(): AudioContext {
  const audioContext = useContext(ReactAudioContext);
  if (!audioContext) {
    throw new Error(
      "useAudioContext must be used within a ReactAudioContext.Provider",
    );
  }
  return audioContext;
}

export function useAudioContextState(): AudioContextState {
  const audioContext = useAudioContext();

  const subscribe = useCallback((callback: () => void) => {
    audioContext.addEventListener("statechange", callback);
    return () => {
      audioContext.removeEventListener("statechange", callback);
    };
  }, [audioContext]);

  const state = useSyncExternalStore(subscribe, () => audioContext.state);

  return state;
}
