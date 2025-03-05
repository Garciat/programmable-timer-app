import { useMemo } from "react";

import { useSpeechSynthesisVoices } from "lib/utils/tts.ts";
import { useAppSettings } from "src/state/context.tsx";
import { UserSoundSettings } from "src/state/types.ts";

export function useAppSettingsVoice(): SpeechSynthesisVoice | null {
  const voices = useSpeechSynthesisVoices();
  const [settings] = useAppSettings();

  const defaultVoice = useMemo(
    () => {
      const defaultVoice = voices.filter((voice) => voice.default);
      if (defaultVoice.length === 1) {
        // OK in Chrome/Firefox, but Safari sets all voices to default
        return defaultVoice[0];
      }

      return null;
    },
    [voices],
  );

  const settingsVoice = useMemo(
    () => voices.find((voice) => voice.voiceURI === settings.ttsVoiceURI),
    [voices, settings.ttsVoiceURI],
  );

  return settingsVoice ?? defaultVoice;
}

export function useAppSoundSettings(): UserSoundSettings {
  const [settings] = useAppSettings();
  return settings.sound;
}
