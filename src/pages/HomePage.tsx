import { TimerPreset } from "../app/types.ts";
import { BaseLayout } from "../components/BaseLayout.tsx";
import { TimerPlayer } from "../components/TimerPlayer.tsx";

export function HomePage() {
  const preset: TimerPreset = {
    root: {
      kind: "sequence",
      elements: [
        {
          kind: "period",
          name: "Work",
          seconds: 5,
        },
        {
          kind: "period",
          name: "Rest",
          seconds: 3,
        },
      ],
    },
  };

  return (
    <BaseLayout>
      <h1>Home</h1>
      <TimerPlayer preset={preset} />
    </BaseLayout>
  );
}
