import { TimerPreset } from "../app/types.ts";
import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";

export function EditPage() {
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
    <BaseLayout>
      <PresetEditor preset={preset} />
    </BaseLayout>
  );
}
