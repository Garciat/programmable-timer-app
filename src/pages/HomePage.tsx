import { useNavigate } from "react-router";

import { FullscreenLayout } from "../components/FullscreenLayout.tsx";
import { PresetDisplay } from "../components/PresetDisplay.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";
import { useAppPreset } from "../state/context.tsx";

export function HomePage() {
  const [preset] = useAppPreset();
  const navigate = useNavigate();

  return (
    <FullscreenLayout>
      <PresetDisplay preset={preset} />
      <div style={{ height: "1rem" }} />
      <button
        type="button"
        onClick={() => {
          navigate("/edit");
        }}
      >
        Edit
      </button>
      <div style={{ height: "2rem" }} />
      <TimerPlayer preset={preset} />
    </FullscreenLayout>
  );
}
