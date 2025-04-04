import { useEffect, useState } from "react";

export interface VoiceInfo {
  ref: SpeechSynthesisVoice;
  locale: string;
  localeLanguage: string;
  localeRegion: string;
}

export function useSpeechSynthesisVoices() {
  const [voices, setVoices] = useState<VoiceInfo[]>(
    () => cleanVoices(globalThis.speechSynthesis.getVoices()),
  );

  // Chrome doesn't populate the voices immediately
  useEffect(() => {
    // If voices are already populated, don't do anything
    // Otherwise voices will cause a re-render, which may cause double-speak
    if (voices.length === 0) {
      setVoices(cleanVoices(globalThis.speechSynthesis.getVoices()));
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setVoices(cleanVoices(globalThis.speechSynthesis.getVoices()));
    };

    globalThis.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      globalThis.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, []);

  return voices;
}

function cleanVoices(voices: SpeechSynthesisVoice[]) {
  const out: VoiceInfo[] = [];

  for (const voice of dedupeVoicesByURI(filterOutBadVoices(voices))) {
    // Android Chrome uses underscores for some reason
    const [localeLanguage, localeRegion] = voice.lang.replace("_", "-").split(
      "-",
    );

    out.push({
      ref: voice,
      locale: voice.lang,
      localeLanguage,
      localeRegion,
    });
  }

  return out;
}

// Safari likes to duplicate voices by URI, so we dedupe them
function dedupeVoicesByURI(voices: SpeechSynthesisVoice[]) {
  const map = new Map<string, SpeechSynthesisVoice>();
  for (const voice of voices) {
    map.set(voice.voiceURI, voice);
  }
  return Array.from(map.values());
}

const BAD_VOICES = [
  "Albert",
  "Bad News",
  "Bahh",
  "Bells",
  "Boing",
  "Bubbles",
  "Cellos",
  "Eddy",
  "Flo",
  "Fred",
  "Good News",
  "Grandma",
  "Grandpa",
  "Jester",
  "Junior",
  "Kathy",
  "Nicky",
  "Organ",
  "Ralph",
  "Reed",
  "Rocko",
  "Sandy",
  "Shelley",
  "Superstar",
  "Trinoids",
  "Whisper",
  "Wobble",
  "Zarvox",
];

const BAD_VOICES_REGEX = new RegExp(BAD_VOICES.join("|"), "i");

function filterOutBadVoices(voices: SpeechSynthesisVoice[]) {
  return voices.filter((voice) => !BAD_VOICES_REGEX.test(voice.name));
}
