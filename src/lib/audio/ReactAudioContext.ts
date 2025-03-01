import { createContext, useContext } from "react";

export const ReactAudioContext = createContext<AudioContext | null>(null);

export function useAudioContext() {
  const audioContext = useContext(ReactAudioContext);
  if (!audioContext) {
    throw new Error(
      "useAudioContext must be used within a ReactAudioContext.Provider",
    );
  }
  return audioContext;
}

// thank you:
// https://www.mattmontag.com/web/unlock-web-audio-in-safari-for-ios-and-macos
export function unlockAudioContext(audioCtx: AudioContext) {
  if (audioCtx.state !== "suspended") return;
  const b = document.body;
  const events = ["touchstart", "touchend", "mousedown", "keydown"];
  events.forEach((e) => b.addEventListener(e, unlock, false));
  function unlock() {
    audioCtx.resume().then(clean);
  }
  function clean() {
    events.forEach((e) => b.removeEventListener(e, unlock));
  }
}
