import { useCallback, useEffect, useMemo, useState } from "react";
import { MoveLeft, Save } from "lucide-react";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { unique } from "lib/utils/array.ts";
import { useSpeechSynthesisVoices } from "lib/utils/tts.ts";
import { useAppSettings } from "src/state/context.tsx";
import { UserSettings } from "src/state/types.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";

export function SettingsPage() {
  const [savedSettings, setSavedSettings] = useAppSettings();

  const [settings, setSettings] = useState<UserSettings>();

  useEffect(() => {
    setSettings(savedSettings);
  }, [savedSettings]);

  const commit = useCallback(() => {
    if (settings) {
      setSavedSettings(() => settings);
    }
  }, [setSavedSettings, settings]);

  const updateVoiceURI = useCallback(
    (voiceURI: string | undefined) => {
      setSettings((settings) => ({
        ...settings,
        ttsVoiceURI: voiceURI,
      }));
    },
    [setSettings],
  );

  // maybe use deep-equal?
  const isModified = useMemo(
    () =>
      settings &&
      savedSettings &&
      JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings],
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
            onClick={commit}
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
          voiceURI={settings?.ttsVoiceURI}
          onChange={updateVoiceURI}
        />
      </VFrame>
    </BaseLayout>
  );
}

interface VoiceSettingsProps {
  voiceURI: string | undefined;
  onChange: (voice: string | undefined) => void;
}

function VoiceSettings(
  { voiceURI, onChange }: VoiceSettingsProps,
) {
  const userLocale = navigator.language;
  const [userLang] = userLocale.split("-");

  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>(userLang);
  const [testSpeechText, setTestSpeechText] = useState<string>("Hello, world!");

  const voices = useSpeechSynthesisVoices();

  const voice = useMemo(
    () => voices.find((voice) => voice.voiceURI === voiceURI),
    [voices, voiceURI],
  );

  const voicesInfo = useMemo(
    () =>
      voices.map((voice) => {
        const [lang, region] = voice.lang.split("-");
        return { voice, lang, region };
      }),
    [voices],
  );

  const languageNames = useMemo(
    () => new Intl.DisplayNames([userLocale], { type: "language" }),
    [userLocale],
  );

  const regionNames = useMemo(
    () => new Intl.DisplayNames([userLocale], { type: "region" }),
    [userLocale],
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
    onChange(value);
  }, [onChange]);

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
