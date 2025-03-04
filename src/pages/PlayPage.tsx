import { useState } from "react";
import { useParams } from "react-router";
import { MoveLeft, Volume2, VolumeOff, VolumeX } from "lucide-react";

import { switching } from "../utils/switch.ts";
import {
  useAudioContext,
  useAudioContextState,
} from "../lib/audio/context.tsx";
import { VFrame } from "../lib/box/mod.ts";
import { useAppPreset } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";
import { VStack } from "../lib/box/VStack.tsx";
import { contrastForegroundColor } from "../utils/color.ts";

export function PlayPage() {
  const { presetId } = useParams();
  const [preset] = useAppPreset(presetId ?? "");

  const audioContext = useAudioContext();
  const audioContextState = useAudioContextState();

  const [color, setColor] = useState<
    { backgroundColor: string; color: string } | null
  >(null);

  function suspendAudio() {
    audioContext.suspend();
  }

  function resumeAudio() {
    audioContext.resume();
  }

  function handleColorChange(color: string) {
    setColor({
      backgroundColor: color,
      color: contrastForegroundColor(color),
    });
  }

  const audioButton = switching(audioContextState, {
    running: () => <IconButton icon={Volume2} onClick={suspendAudio} />,
    suspended: () => <IconButton icon={VolumeOff} onClick={resumeAudio} />,
    closed: () => <IconButton icon={VolumeX} disabled />,
  });

  return (
    <BaseLayout>
      <VStack grow={1} alignItems="stretch" style={{ ...color }}>
        <TitleBar
          hideShadow
          left={
            <IconButton
              icon={MoveLeft}
              href="/"
              transitions={["from-bottom-backwards"]}
            />
          }
          middle={<TitleBarText value={preset?.name ?? "Not Found"} />}
          right={audioButton}
        />
        <VFrame
          alignItems="stretch"
          justify="flex-start"
          className={stylesAll["content-frame"]}
        >
          {preset
            ? <TimerPlayer preset={preset} onColorChange={handleColorChange} />
            : (
              <p style={{ textAlign: "center" }}>
                This preset does not exist.
              </p>
            )}
        </VFrame>
      </VStack>
    </BaseLayout>
  );
}
