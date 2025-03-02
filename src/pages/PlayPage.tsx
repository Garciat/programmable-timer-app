import { useNavigate, useParams } from "react-router";
import { MoveLeft } from "lucide-react";

import { useAppPreset } from "../state/context.tsx";
import { FullscreenLayout } from "../components/FullscreenLayout.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";
import { TitleBar } from "../components/TitleBar.tsx";

import classes from "./PlayPage.module.css";

export function PlayPage() {
  const navigate = useNavigate();

  const { presetId } = useParams();
  const [preset] = useAppPreset(presetId ?? "");

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

  return (
    <FullscreenLayout>
      <div className={classes["play-page"]}>
        <TitleBar
          left={backButton}
          middle={<h1>{preset?.name ?? "Not Found"}</h1>}
        />
        {preset
          ? <TimerPlayer preset={preset} autoplay />
          : <p style={{ textAlign: "center" }}>This preset does not exist.</p>}
      </div>
    </FullscreenLayout>
  );
}
