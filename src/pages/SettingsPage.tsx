import { useCallback, useEffect, useMemo, useState } from "react";
import { MoveLeft, Save } from "lucide-react";

import { VFrame, VStack } from "lib/box/mod.ts";
import { useSpeechSynthesisVoices } from "lib/utils/tts.ts";
import { useAppSettings } from "src/state/context.tsx";
import { useAppSettingsVoice } from "src/state/utils.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function SettingsPage() {
  const [, setSettings] = useAppSettings();
  const settingsVoice = useAppSettingsVoice();

  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice>();

  useEffect(() => {
    setSelectedVoice(settingsVoice);
  }, [settingsVoice]);

  const saveSettings = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      ttsVoiceURI: selectedVoice?.voiceURI,
    }));
  }, [setSettings, selectedVoice]);

  const isModified = useMemo(
    () => selectedVoice?.voiceURI !== settingsVoice?.voiceURI,
    [selectedVoice, settingsVoice],
  );

  return (
    <BaseLayout>
      <TitleBar
        left={
          <IconButton
            icon={MoveLeft}
            href="/"
            transitions={["from-left-backwards"]}
          />
        }
        middle={<TitleBarText value="Settings" />}
        right={
          <IconButton
            icon={Save}
            disabled={!isModified}
            onClick={saveSettings}
          />
        }
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        gap="1rem"
        className={stylesAll["content-frame"]}
      >
        <VStack kind="section" alignItems="stretch" justify="flex-start">
          <h2>General</h2>
          <p>Browser Language</p>
          <input
            type="text"
            value={navigator.language}
            readOnly
            disabled
          />
        </VStack>
        <VoiceSettings
          voice={selectedVoice}
          onChange={setSelectedVoice}
        />
      </VFrame>
    </BaseLayout>
  );
}

interface VoiceSettingsProps {
  voice: SpeechSynthesisVoice | undefined;
  onChange: (voice: SpeechSynthesisVoice | undefined) => void;
}

function VoiceSettings(
  { voice, onChange }: VoiceSettingsProps,
) {
  const userLang = navigator.language;

  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>(userLang);
  const [testSpeechText, setTestSpeechText] = useState<string>("Hello, world!");

  const voices = useSpeechSynthesisVoices();

  useEffect(() => {
    setSelectedVoiceLang(voice?.lang ?? userLang);
  }, [voice]);

  const languageNames = useMemo(
    () => new Intl.DisplayNames([userLang], { type: "language" }),
    [userLang],
  );

  const voiceLangs = useMemo(
    () => Array.from(new Set(voices.map((voice) => voice.lang))).toSorted(),
    [voices],
  );

  const handleLangChange = useCallback((value: string) => {
    setSelectedVoiceLang(value);
    onChange(undefined);
  }, [onChange]);

  const handleVoiceChange = useCallback((value: string) => {
    onChange(voices.find((voice) => voice.voiceURI === value));
  }, [onChange, voices]);

  const testSpeechSynthesis = useCallback(() => {
    if (voice) {
      const utterance = new SpeechSynthesisUtterance(testSpeechText);
      utterance.voice = voice;
      globalThis.speechSynthesis.speak(utterance);
    }
  }, [voice, testSpeechText]);

  return (
    <VStack kind="section" alignItems="stretch" justify="flex-start">
      <h2>Speech Synthesis</h2>
      <p>Language</p>
      <select
        value={selectedVoiceLang}
        onChange={(e) => handleLangChange(e.target.value)}
      >
        <option value="">Select a language</option>
        {Array.from(voiceLangs).map((lang) => (
          <option key={lang} value={lang}>
            {`${lang} (${languageNames.of(lang)})`}
          </option>
        ))}
      </select>
      <p>Voice</p>
      <select
        value={voice?.name}
        onChange={(e) => handleVoiceChange(e.target.value)}
      >
        <option value="">Select a voice</option>
        {voices
          .filter((voice) => voice.lang === selectedVoiceLang)
          .map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name}
            </option>
          ))}
      </select>
      <p>Test</p>
      <input
        type="text"
        value={testSpeechText}
        onChange={(e) => setTestSpeechText(e.target.value)}
      />
      <button
        type="button"
        disabled={voice === undefined}
        onClick={testSpeechSynthesis}
      >
        Speak
      </button>
    </VStack>
  );
}
