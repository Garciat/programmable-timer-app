import { Calculator, Menu, Play, Plus, Timer, Trash2 } from "lucide-react";

import { HStack, VFrame, VStack } from "lib/box/mod.ts";
import { PlayerSession } from "src/state/types.ts";
import {
  useAppPlayerSession,
  useAppPreset,
  useAppPresets,
} from "src/state/context.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { MainNav } from "src/components/MainNav.tsx";
import { PresetList } from "src/components/PresetList.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { routeNewPreset, routePlayPreset, routeSettings } from "src/routes.ts";

import stylesAll from "src/pages/all.module.css";
import { formatSeconds } from "lib/utils/time.ts";

export function HomePage() {
  const presets = useAppPresets();
  const [playerSession] = useAppPlayerSession();

  return (
    <BaseLayout title="Programmable Timer">
      <TitleBar
        left={
          <IconButton
            icon={Menu}
            href={routeSettings()}
            transitions={["from-left"]}
          />
        }
        middle={
          <>
            <Calculator size="1.5rem" />
            <Timer size="1.5rem" />
          </>
        }
        right={
          <IconButton
            icon={Plus}
            href={routeNewPreset()}
            transitions={["from-right"]}
          />
        }
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        gap="2rem"
        className={stylesAll["content-frame"]}
      >
        {presets.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No presets yet. Click the plus button to create one.
          </p>
        )}
        {playerSession && (
          <PlayerSessionDisplay
            playerSession={playerSession}
          />
        )}
        <PresetList presets={presets} />
      </VFrame>
      <MainNav />
    </BaseLayout>
  );
}

function PlayerSessionDisplay(
  { playerSession }: { playerSession: PlayerSession },
) {
  const { presetId, startDateTime, secondsElapsed } = playerSession;
  const [preset] = useAppPreset(presetId);
  const [_session, { clear: clearPlayerSession }] = useAppPlayerSession();

  const handleClearSession = () => {
    clearPlayerSession();
  };

  return preset && (
    <HStack
      justify="space-between"
      gap="1rem"
      className={stylesAll["session-display"]}
    >
      <VStack alignItems="flex-start" gap="0.5rem">
        <h2>Resume session?</h2>
        <p>{preset.name}</p>
        <p>{startDateTime.toDateString()}</p>
        <p>{formatSeconds(secondsElapsed)}</p>
      </VStack>
      <HStack gap="0.5rem">
        <IconButton
          icon={Play}
          href={routePlayPreset(presetId, { start: secondsElapsed })}
          transitions={["from-bottom"]}
        />
        <IconButton
          icon={Trash2}
          onClick={handleClearSession}
        />
      </HStack>
    </HStack>
  );
}
