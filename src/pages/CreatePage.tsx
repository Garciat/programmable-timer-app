import { useState } from "react";
import { useNavigate } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "../lib/box/VFrame.tsx";
import { TimerPreset } from "../app/types.ts";
import { useAppPresetAdd } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { TitleBar } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";
import classes from "./Editor.module.css";

export function CreatePage() {
  const navigate = useNavigate();
  const doPresetAdd = useAppPresetAdd();

  const [preset, setPreset] = useState<TimerPreset>({
    id: crypto.randomUUID(),
    name: "New Preset",
    root: {
      kind: "sequence",
      elements: [
        {
          kind: "loop",
          count: 4,
          element: {
            kind: "sequence",
            elements: [
              { kind: "period", seconds: 60, name: "Work" },
              { kind: "period", seconds: 60, name: "Rest" },
            ],
          },
        },
      ],
    },
  });

  function goBack() {
    navigate("/");
  }

  function updateName(name: string) {
    setPreset((prev) => prev && { ...prev, name });
  }

  function savePreset() {
    doPresetAdd(preset);
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

  const saveButton = (
    <button
      type="button"
      onClick={savePreset}
    >
      <Save size={24} />
    </button>
  );

  const titleEditor = (
    <input
      type="text"
      autoFocus
      value={preset.name}
      onChange={(e) => updateName(e.target.value)}
      className={classes["title-input"]}
    />
  );

  return (
    <BaseLayout>
      <TitleBar left={backButton} middle={titleEditor} right={saveButton} />
      <VFrame className={stylesAll["content-frame"]}>
        <PresetEditor preset={preset} onChange={setPreset} />
      </VFrame>
    </BaseLayout>
  );
}
