import { useParams } from "react-router";
import { MoveLeft, Volume2, VolumeOff, VolumeX } from "lucide-react";

import { switching } from "../utils/switch.ts";
import {
  useAudioContext,
  useAudioContextState,
} from "../lib/audio/context.tsx";
import { VFrame } from "../lib/box/VFrame.tsx";
import { useAppPreset } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { NavButton } from "../components/NavButton.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function PlayPage() {
  const { presetId } = useParams();
  const [preset] = useAppPreset(presetId ?? "");

  const audioContext = useAudioContext();
  const audioContextState = useAudioContextState();

  function suspendAudio() {
    audioContext.suspend();
  }

  function resumeAudio() {
    audioContext.resume();
  }

  const audioButton = switching(audioContextState, {
    running: () => <NavButton icon={Volume2} onClick={suspendAudio} />,
    suspended: () => <NavButton icon={VolumeOff} onClick={resumeAudio} />,
    closed: () => <NavButton icon={VolumeX} disabled />,
  });

  return (
    <BaseLayout>
      <TitleBar
        left={
          <NavButton
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
          ? <TimerPlayer preset={preset} />
          : <p style={{ textAlign: "center" }}>This preset does not exist.</p>}
      </VFrame>
    </BaseLayout>
  );
}
