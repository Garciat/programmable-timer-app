import { useState } from "react";
import { useNavigate } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { TimerPreset } from "../app/types.ts";
import { useAppPresetAdd } from "../state/context.tsx";
import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { TitleBar } from "../components/TitleBar.tsx";

import classes from "./CreatePage.module.css";

export function CreatePage() {
  const navigate = useNavigate();
  const doPresetAdd = useAppPresetAdd();

  const [preset, setPreset] = useState<TimerPreset>({
    id: crypto.randomUUID(),
    name: "New Preset",
    root: {
      kind: "sequence",
      elements: [
        { kind: "period", seconds: 60, name: "Work" },
      ],
    },
  });

  function goBack() {
    navigate("/");
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
      value={preset.name}
      onChange={(e) => setPreset({ ...preset, name: e.target.value })}
      className={classes["title-editor"]}
    />
  );

  return (
    <BaseLayout>
      <div className={classes["create-page"]}>
        <TitleBar left={backButton} middle={titleEditor} right={saveButton} />
        <PresetEditor preset={preset} onChange={setPreset} />
      </div>
    </BaseLayout>
  );
}
