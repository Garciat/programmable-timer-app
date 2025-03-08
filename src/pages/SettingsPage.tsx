import { useCallback, useEffect, useMemo, useState } from "react";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "lib/box/mod.ts";
import { useAppSettings } from "src/state/context.tsx";
import { DEFAULT_APP_STATE } from "src/state/default.ts";
import { UserSettings, UserSoundSettings } from "src/state/types.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { AdvancedSection } from "src/pages/settings/AdvancedSection.tsx";
import { GeneralSection } from "src/pages/settings/GeneralSection.tsx";
import { HistorySection } from "src/pages/settings/HistorySection.tsx";
import { SoundSection } from "src/pages/settings/SoundSection.tsx";
import { VoiceSection } from "src/pages/settings/VoiceSection.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";
import styles from "src/pages/settings/all.module.css";

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
        <GeneralSection />
        <HistorySection />
        <SoundSection
          settings={settings.sound}
          onChange={updateSoundSettings}
        />
        <VoiceSection
          voiceURI={settings?.ttsVoiceURI}
          onChange={updateVoiceURI}
        />
        <AdvancedSection />
      </VFrame>
    </BaseLayout>
  );
}
