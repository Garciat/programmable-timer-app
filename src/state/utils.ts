import { useMemo } from "react";

import { useSpeechSynthesisVoices } from "lib/utils/tts.ts";
import { useAppSettings, useAppState } from "src/state/context.tsx";
import { DEFAULT_APP_STATE } from "src/state/default.ts";
import { UserSoundSettings } from "src/state/types.ts";

export function useAppSettingsReset(): () => void {
  const [, setState] = useAppState();

  const reset = useMemo(
    () => () => setState(DEFAULT_APP_STATE),
    [setState],
  );

  return reset;
}

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
