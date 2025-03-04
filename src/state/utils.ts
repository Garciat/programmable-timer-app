import { useMemo } from "react";

import { useSpeechSynthesisVoices } from "lib/utils/tts.ts";
import { useAppSettings } from "src/state/context.tsx";

export function useAppSettingsVoice(): SpeechSynthesisVoice | undefined {
  const voices = useSpeechSynthesisVoices();
  const [settings] = useAppSettings();

  const defaultVoice = useMemo(
    () => voices.find((voice) => voice.default),
    [voices],
  );

  const settingsVoice = useMemo(
    () => voices.find((voice) => voice.voiceURI === settings.ttsVoiceURI),
    [voices, settings.ttsVoiceURI],
  );

  return settingsVoice ?? defaultVoice;
}
