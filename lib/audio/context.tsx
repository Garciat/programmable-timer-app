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

// iOS Safari has an additional state "interrupted" when the user leaves the page
// See: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state#resuming_interrupted_play_states_in_ios_safari
export function useAudioContextState(): AudioContextState | "interrupted" {
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
