import { useNavigate, useParams } from "react-router";
import { MoveLeft, Volume2, VolumeOff, VolumeX } from "lucide-react";

import { switching } from "../utils/switch.ts";
import {
  useAudioContext,
  useAudioContextState,
} from "../lib/audio/context.tsx";
import { VFrame } from "../lib/box/VFrame.tsx";
import { useAppPreset } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function PlayPage() {
  const navigate = useNavigate();

  const { presetId } = useParams();
  const [preset] = useAppPreset(presetId ?? "");

  const audioContext = useAudioContext();
  const audioContextState = useAudioContextState();

  function goBack() {
    navigate("/");
  }

  const backButton = (
    <button
      type="button"
      onClick={goBack}
    >
      <MoveLeft size={24} />
    </button>
  );

  const audioButton = switching(audioContextState, {
    running: () => (
      <button
        type="button"
        onClick={() => audioContext.suspend()}
      >
        <Volume2 size={24} />
      </button>
    ),
    suspended: () => (
      <button
        type="button"
        onClick={() => audioContext.resume()}
      >
        <VolumeOff size={24} />
      </button>
    ),
    closed: () => (
      <button
        type="button"
        disabled
      >
        <VolumeX size={24} />
      </button>
    ),
  });

  return (
    <BaseLayout>
      <TitleBar
        left={backButton}
        middle={<TitleBarText value={preset?.name ?? "Not Found"} />}
        right={audioButton}
      />
      <VFrame className={stylesAll["content-frame"]}>
        {preset
          ? <TimerPlayer preset={preset} />
          : <p style={{ textAlign: "center" }}>This preset does not exist.</p>}
      </VFrame>
    </BaseLayout>
  );
}
