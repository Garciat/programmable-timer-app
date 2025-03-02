import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { MoveLeft } from "lucide-react";

import { useAppPreset } from "../state/context.tsx";
import { FullscreenLayout } from "../components/FullscreenLayout.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";

import classes from "./PlayPage.module.css";

export function PlayPage() {
  const navigate = useNavigate();

  const { presetId } = useParams();
  const [preset] = useAppPreset(presetId ?? "");

  useEffect(() => {
    if (!preset) {
      navigate("/");
    }
  }, [preset, navigate]);

  function goBack() {
    navigate("/");
  }

  return (
    <FullscreenLayout>
      <div className={classes["play-page"]}>
        <header>
          <div className={classes["around"]}>
            <button
              type="button"
              onClick={goBack}
            >
              <MoveLeft size={24} />
            </button>
          </div>
          <h1>{preset?.name}</h1>
          <div className={classes["around"]}>
          </div>
        </header>
        {preset && <TimerPlayer preset={preset} autoplay />}
      </div>
    </FullscreenLayout>
  );
}
