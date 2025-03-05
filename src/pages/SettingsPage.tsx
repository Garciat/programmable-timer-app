import { useCallback, useEffect, useMemo, useState } from "react";
import { MoveLeft, Save } from "lucide-react";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { useSpeechSynthesisVoices } from "lib/utils/tts.ts";
import { useAppSettings } from "src/state/context.tsx";
import { useAppSettingsVoice } from "src/state/utils.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";
import { unique } from "lib/utils/array.ts";

export function SettingsPage() {
  const [, setSettings] = useAppSettings();
  const settingsVoice = useAppSettingsVoice();

  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice>();

  useEffect(() => {
    setSelectedVoice(settingsVoice ?? undefined);
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
    <BaseLayout title="Settings">
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
  const [userLang] = navigator.language.split("-");

  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>(userLang);
  const [testSpeechText, setTestSpeechText] = useState<string>("Hello, world!");

  const voices = useSpeechSynthesisVoices();

  const voicesInfo = useMemo(
    () =>
      voices.map((voice) => {
        const [lang, region] = voice.lang.split("-");
        return { voice, lang, region };
      }),
    [voices],
  );

  const languageNames = useMemo(
    () => new Intl.DisplayNames([userLang], { type: "language" }),
    [userLang],
  );

  const regionNames = useMemo(
    () => new Intl.DisplayNames([userLang], { type: "region" }),
    [userLang],
  );

  const voiceLangs = useMemo(
    () => unique(voicesInfo.map((info) => info.lang)),
    [voicesInfo],
  );

  const selectedLangVoicesByRegion = useMemo(
    () => {
      const map = new Map<string, SpeechSynthesisVoice[]>();
      for (const { voice, lang, region } of voicesInfo) {
        if (lang === selectedVoiceLang) {
          const regionVoices = map.get(region) ?? [];
          map.set(region, [...regionVoices, voice]);
        }
      }
      return map;
    },
    [voicesInfo, selectedVoiceLang],
  );

  useEffect(() => {
    setSelectedVoiceLang(voice?.lang.split("-")[0] ?? userLang);
  }, [voice]);

  const handleLangChange = useCallback((value: string) => {
    setSelectedVoiceLang(value);
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
        {Array.from(voiceLangs).toSorted().map((lang) => (
          <option key={lang} value={lang}>
            {`${lang} (${languageNames.of(lang)})`}
          </option>
        ))}
      </select>
      <p>Voice</p>
      <select
        value={voice?.voiceURI}
        onChange={(e) => handleVoiceChange(e.target.value)}
      >
        <option value="">Select a voice</option>
        {Array.from(selectedLangVoicesByRegion.entries())
          .toSorted(([a], [b]) => a.localeCompare(b))
          .map(
            ([region, voices]) => (
              <optgroup
                key={region}
                label={`${region} (${regionNames.of(region)})`}
              >
                {voices
                  .toSorted((a, b) => a.name.localeCompare(b.name))
                  .map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name}
                    </option>
                  ))}
              </optgroup>
            ),
          )}
      </select>
      <p>Test</p>
      <HStack gap="1rem">
        <input
          type="text"
          value={testSpeechText}
          onChange={(e) => setTestSpeechText(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button
          type="button"
          disabled={voice === undefined}
          onClick={testSpeechSynthesis}
        >
          Speak
        </button>
      </HStack>
    </VStack>
  );
}
