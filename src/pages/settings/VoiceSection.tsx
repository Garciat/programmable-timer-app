import { useCallback, useEffect, useMemo, useState } from "react";
import { Speech } from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { unique } from "lib/utils/array.ts";
import { trying } from "lib/utils/exceptions.ts";
import { useSpeechSynthesisVoices, VoiceInfo } from "lib/utils/tts.ts";

interface VoiceSectionProps {
  voiceURI: string | undefined;
  onChange: (voice: string | undefined) => void;
}

export function VoiceSection(
  { voiceURI, onChange }: VoiceSectionProps,
) {
  const userLocale = navigator.language;
  const [userLang] = userLocale.split("-");

  const [selectedVoiceLang, setSelectedVoiceLang] = useState<string>(userLang);
  const [testSpeechText, setTestSpeechText] = useState<string>("Hello, world!");

  const voices = useSpeechSynthesisVoices();

  const voice = useMemo(
    () => voices.find((voice) => voice.ref.voiceURI === voiceURI),
    [voices, voiceURI],
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
    () => unique(voices.map((voice) => voice.localeLanguage)),
    [voices],
  );

  const selectedLangVoicesByRegion = useMemo(
    () => {
      const map = new Map<string, VoiceInfo[]>();
      for (const voice of voices) {
        if (voice.localeLanguage === selectedVoiceLang) {
          const regionVoices = map.get(voice.localeRegion) ?? [];
          map.set(voice.localeRegion, [...regionVoices, voice]);
        }
      }
      return map;
    },
    [voices, selectedVoiceLang],
  );

  useEffect(() => {
    setSelectedVoiceLang(voice?.localeLanguage ?? userLang);
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
      utterance.voice = voice.ref;
      utterance.lang = voice.locale;
      globalThis.speechSynthesis.cancel();
      globalThis.speechSynthesis.speak(utterance);

      return () => {
        globalThis.speechSynthesis.cancel();
      };
    }
  }, [voice, testSpeechText]);

  return (
    <VStack kind="section">
      <HStack kind="header">
        <Speech />
        <h2>Speech Synthesis</h2>
      </HStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Language</h3>
        </HStack>
        <select
          value={selectedVoiceLang}
          onChange={(e) => handleLangChange(e.target.value)}
        >
          <option value="">Select a language</option>
          {Array.from(voiceLangs).toSorted().map((lang) => (
            <option key={lang} value={lang}>
              {`${lang}${
                trying(() => ` (${languageNames.of(lang)})`) ?? ""
              }`}
            </option>
          ))}
        </select>
      </VStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Voice</h3>
        </HStack>
        <select
          value={voice?.ref?.voiceURI}
          onChange={(e) => handleVoiceChange(e.target.value)}
        >
          <option value="">Select a voice</option>
          {Array.from(selectedLangVoicesByRegion.entries())
            .toSorted(([a], [b]) => a.localeCompare(b))
            .map(
              ([region, voices]) => (
                <optgroup
                  key={region}
                  label={`${region}${
                    trying(() => ` (${regionNames.of(region)})`) ?? ""
                  }`}
                >
                  {voices
                    .toSorted((a, b) => a.ref.name.localeCompare(b.ref.name))
                    .map((voice) => (
                      <option
                        key={voice.ref.voiceURI}
                        value={voice.ref.voiceURI}
                      >
                        {voice.ref.name}
                      </option>
                    ))}
                </optgroup>
              ),
            )}
        </select>
      </VStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Test</h3>
        </HStack>
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
    </VStack>
  );
}
