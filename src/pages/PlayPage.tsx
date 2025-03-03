import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { MoveLeft, Volume2, VolumeOff, VolumeX } from "lucide-react";

import {
  useAudioContext,
  useAudioContextState,
} from "../lib/audio/context.tsx";
import { useAppPreset } from "../state/context.tsx";
import { FullscreenLayout } from "../components/FullscreenLayout.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import classes from "./PlayPage.module.css";
import { switching } from "../utils/switch.ts";

export function PlayPage() {
  const navigate = useNavigate();

  const { presetId } = useParams();
  const [preset] = useAppPreset(presetId ?? "");

  const audioContext = useAudioContext();
  const audioContextState = useAudioContextState();

  useEffect(() => {
    audioContext.resume();
  }, [audioContext]);

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
    <FullscreenLayout>
      <div className={classes["play-page"]}>
        <TitleBar
          left={backButton}
          middle={<TitleBarText value={preset?.name ?? "Not Found"} />}
          right={audioButton}
        />
        {preset
          ? <TimerPlayer preset={preset} autoplay />
          : <p style={{ textAlign: "center" }}>This preset does not exist.</p>}
      </div>
    </FullscreenLayout>
  );
}
