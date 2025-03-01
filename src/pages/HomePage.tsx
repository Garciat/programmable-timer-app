import { TimerPreset } from "../app/types.ts";
import { FullscreenLayout } from "../components/FullscreenLayout.tsx";
import { PresetDisplay } from "../components/PresetDisplay.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";

export function HomePage() {
  const preset: TimerPreset = {
    root: {
      kind: "sequence",
      elements: [
        {
          kind: "period",
          name: "Prepare",
          seconds: 5,
        },
        {
          kind: "loop",
          count: 10,
          element: {
            kind: "sequence",
            elements: [
              {
                kind: "period",
                name: "Left",
                seconds: 10,
              },
              {
                kind: "period",
                name: "Switch",
                seconds: 3,
              },
              {
                kind: "period",
                name: "Right",
                seconds: 10,
              },
              {
                kind: "period",
                name: "Rest",
                seconds: 10,
              },
            ],
          },
        },
      ],
    },
  };

  return (
    <FullscreenLayout>
      <PresetDisplay preset={preset} />
      <div style={{ height: "1rem" }} />
      <TimerPlayer preset={preset} />
    </FullscreenLayout>
  );
}
