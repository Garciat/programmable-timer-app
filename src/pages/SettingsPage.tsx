import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BellRing,
  MonitorCheck,
  MonitorCog,
  MonitorDown,
  MonitorX,
  MoveLeft,
  Save,
  Speech,
  Wrench,
} from "lucide-react";

import { useAudioContext } from "lib/audio/context.tsx";
import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { unique } from "lib/utils/array.ts";
import { switching } from "lib/utils/switch.ts";
import { trying } from "lib/utils/exceptions.ts";
import { useSpeechSynthesisVoices } from "lib/utils/tts.ts";
import { useInstallPrompt } from "src/transient/install.tsx";
import { useAppSettings } from "src/state/context.tsx";
import { DEFAULT_APP_STATE } from "src/state/default.ts";
import { UserSettings, UserSoundSettings } from "src/state/types.ts";
import { useAppSettingsReset } from "src/state/utils.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";
import styles from "src/pages/SettingsPage.module.css";

export function SettingsPage() {
  const [savedSettings, setSavedSettings] = useAppSettings();

  const [settings, setSettings] = useState<UserSettings>(
    DEFAULT_APP_STATE.settings,
  );

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
      setSettings((prev) => ({
        ...prev,
        ttsVoiceURI: voiceURI,
      }));
    },
    [setSettings],
  );

  const updateSoundSettings = useCallback(
    (soundSettings: UserSoundSettings) => {
      setSettings((prev) => ({
        ...prev,
        sound: soundSettings,
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
        className={`${stylesAll["content-frame"]} ${styles["settings-page"]}`}
      >
        <VStack kind="section">
          <HStack kind="header">
            <MonitorCog />
            <h2>General</h2>
          </HStack>
          <InstallAppSubsection />
          <VStack kind="article">
            <HStack kind="header">
              <h3>Browser Language</h3>
            </HStack>
            <input
              type="text"
              value={navigator.language}
              readOnly
              disabled
            />
          </VStack>
        </VStack>
        <SoundSettings
          settings={settings.sound}
          onChange={updateSoundSettings}
        />
        <VoiceSettings
          voiceURI={settings?.ttsVoiceURI}
          onChange={updateVoiceURI}
        />
        <AdvancedSection />
      </VFrame>
    </BaseLayout>
  );
}

interface SoundSettingsProps {
  settings: UserSoundSettings;
  onChange: (settings: UserSoundSettings) => void;
}

function SoundSettings(
  { settings, onChange }: SoundSettingsProps,
) {
  const audioContext = useAudioContext();

  // relative to A4
  const note = Math.round(
    12 * Math.log2(settings.beepFrequency / 440),
  );

  // note name with octave number, note=0 is A4, note=-12 is A3, etc.
  const noteName = useMemo(() => {
    const notes = [
      "A",
      "A♯",
      "B",
      "C",
      "C♯",
      "D",
      "D♯",
      "E",
      "F",
      "F♯",
      "G",
      "G♯",
    ];
    const octave = Math.floor(note / 12) + 4;
    const noteName = notes[(120 + note) % 12];
    return `${noteName}${octave}`;
  }, [note]);

  const handleNoteChange = useCallback((note: number) => {
    const frequency = 440 * Math.pow(2, note / 12);
    onChange({
      ...settings,
      beepFrequency: frequency,
    });
  }, [settings, onChange]);

  const handleDurationChange = useCallback((duration: number) => {
    onChange({
      ...settings,
      beepDuration: duration,
    });
  }, [settings, onChange]);

  const playBeep = useCallback(() => {
    if (!audioContext) {
      return;
    }

    audioContext.resume();

    const gain = audioContext.createGain();
    gain.gain.value = 0;
    gain.connect(audioContext.destination);

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = settings.beepFrequency;
    oscillator.type = settings.beepWaveform;
    oscillator.connect(gain);
    oscillator.start();

    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(1, now);
    gain.gain.setValueAtTime(0, now + settings.beepDuration);
  }, [
    audioContext,
    settings.beepFrequency,
    settings.beepDuration,
    settings.beepWaveform,
  ]);

  const WaveformOption = (
    props: {
      name: string;
      value: typeof settings.beepWaveform;
    },
  ) => (
    <label className={styles["radio-option"]}>
      <span>{props.name}</span>
      <input
        type="radio"
        name="beepWaveform"
        checked={settings.beepWaveform === props.value}
        onChange={() => onChange({ ...settings, beepWaveform: props.value })}
      />
    </label>
  );

  return (
    <VStack kind="section">
      <HStack kind="header">
        <BellRing />
        <h2>Sound</h2>
      </HStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Beep Frequency</h3>
        </HStack>
        <HStack gap="1rem">
          <span style={{ minWidth: "4ch" }}>{noteName}</span>
          <input
            type="range"
            value={note}
            min={-24}
            max={+24}
            step={1}
            onChange={(e) => handleNoteChange(e.target.valueAsNumber)}
            style={{ flexGrow: 1 }}
          />
          <button
            type="button"
            onClick={playBeep}
          >
            Play
          </button>
        </HStack>
      </VStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Beep Duration</h3>
        </HStack>
        <HStack gap="1rem">
          <span style={{ minWidth: "4ch" }}>{settings.beepDuration}s</span>
          <input
            type="range"
            value={settings.beepDuration}
            min={0.1}
            max={0.9}
            step={0.1}
            onChange={(e) => handleDurationChange(e.target.valueAsNumber)}
            style={{ flexGrow: 1 }}
          />
        </HStack>
      </VStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Beep Waveform</h3>
        </HStack>
        <HStack gap="0.5rem" justify="flex-start" wrap="wrap">
          <WaveformOption name="Sine" value="sine" />
          <WaveformOption name="Square" value="square" />
          <WaveformOption name="Sawtooth" value="sawtooth" />
          <WaveformOption name="Triangle" value="triangle" />
        </HStack>
      </VStack>
    </VStack>
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
        // Android Chrome uses underscores, but Intl.DisplayNames uses hyphens
        const [lang, region] = voice.lang.replace("_", "-").split("-");
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
                  label={`${region}${
                    trying(() => ` (${regionNames.of(region)})`) ?? ""
                  }`}
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

function InstallAppSubsection() {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const installPromptEvent = useInstallPrompt();

  useEffect(() => {
    setIsInstalled(
      globalThis.matchMedia("(display-mode: standalone)").matches ||
        (globalThis.navigator.standalone ?? false),
    );

    // Can't get this to work yet

    // if (globalThis.navigator.getInstalledRelatedApps) {
    //   globalThis.navigator.getInstalledRelatedApps().then((apps) => {
    //     setIsInstalled(apps.length > 0);
    //   });
    // }
  }, []);

  const handleInstallRequest = useCallback(async () => {
    if (installPromptEvent) {
      const result = await installPromptEvent.prompt();
      if (result.outcome === "accepted") {
        setIsInstalled(true);
      }
    }
  }, [installPromptEvent]);

  const installationState = useMemo(() => {
    if (isInstalled) {
      return "installed";
    } else if (installPromptEvent) {
      return "canInstall";
    } else {
      return "unavailable";
    }
  }, [isInstalled, installPromptEvent]);

  const installButton = switching(installationState, {
    installed: () => (
      <button
        type="button"
        className={`${styles["install-button"]} ${styles["disabled"]}`}
      >
        <MonitorCheck />
        <span>Installed!</span>
      </button>
    ),
    canInstall: () => (
      <button
        type="button"
        onClick={handleInstallRequest}
        className={`${styles["install-button"]}`}
      >
        <MonitorDown />
        <span>Install</span>
      </button>
    ),
    unavailable: () => (
      <button
        type="button"
        className={`${styles["install-button"]} ${styles["disabled"]}`}
      >
        <MonitorX />
        <span>Cannot prompt app installation</span>
      </button>
    ),
  });

  return (
    <>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Install App</h3>
        </HStack>
        <HStack justify="flex-start">
          {installButton}
        </HStack>
      </VStack>
    </>
  );
}

function AdvancedSection() {
  return (
    <VStack kind="section">
      <HStack kind="header">
        <Wrench />
        <h2>Advanced</h2>
      </HStack>
      <DeleteDataSubsection />
      <ServiceWorkersSubsection />
    </VStack>
  );
}

function DeleteDataSubsection() {
  const reset = useAppSettingsReset();

  const handleResetRequest = useCallback(() => {
    if (globalThis.confirm("Are you sure you want to delete all data?")) {
      reset();
      globalThis.alert("All data has been deleted.");
    }
  }, [reset]);

  return (
    <VStack kind="article">
      <HStack kind="header">
        <h3>Delete Data</h3>
      </HStack>
      <HStack gap="1rem" justify="flex-start">
        <button type="button" onClick={handleResetRequest}>
          Delete All Data
        </button>
      </HStack>
    </VStack>
  );
}

function ServiceWorkersSubsection() {
  // Note that these go stale and cannot be relied upon for actions
  const [serviceWorkerRegistrations, setServiceWorkerRegistrations] = useState<
    readonly ServiceWorkerRegistration[]
  >([]);

  useEffect(() => {
    globalThis.navigator.serviceWorker.getRegistrations().then(
      (registrations) => {
        setServiceWorkerRegistrations(registrations);
      },
    );
  }, []);

  const unregisterServiceWorkers = useCallback(async () => {
    const registrations = await globalThis.navigator.serviceWorker
      .getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    alert("Service Workers unregistered. Reloading the page.");
    globalThis.location.reload();
  }, []);

  return (
    <VStack kind="article">
      <HStack kind="header">
        <h3>Service Workers</h3>
      </HStack>
      <pre>
        {serviceWorkerRegistrations.map((registration) => registration.active?.scriptURL).join("\n") || "No Service Workers"}
      </pre>
      <HStack gap="1rem" justify="flex-start">
        <button type="button" onClick={unregisterServiceWorkers}>
          Unregister All
        </button>
      </HStack>
    </VStack>
  );
}
