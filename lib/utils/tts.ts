import { useEffect, useState } from "react";

export function useSpeechSynthesisVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Get voices on first render, otherwise the list will be empty
  useEffect(() => {
    setVoices(globalThis.speechSynthesis.getVoices());
  }, []);

  useEffect(() => {
    const handler = () => {
      setVoices(globalThis.speechSynthesis.getVoices());
    };

    globalThis.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      globalThis.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, []);

  return voices;
}
