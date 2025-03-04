import { useEffect, useState } from "react";

export function useSpeechSynthesisVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Get voices on first render, otherwise the list will be empty
  useEffect(() => {
    setVoices(dedupeVoicesByURI(globalThis.speechSynthesis.getVoices()));
  }, []);

  useEffect(() => {
    const handler = () => {
      setVoices(dedupeVoicesByURI(globalThis.speechSynthesis.getVoices()));
    };

    globalThis.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      globalThis.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, []);

  return voices;
}

// Safari likes to duplicate voices by URI, so we dedupe them
function dedupeVoicesByURI(voices: SpeechSynthesisVoice[]) {
  const map = new Map<string, SpeechSynthesisVoice>();
  for (const voice of voices) {
    map.set(voice.voiceURI, voice);
  }
  return Array.from(map.values());
}
