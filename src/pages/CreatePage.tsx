import { useState } from "react";
import { useNavigate } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { useAppPresetAdd } from "../state/context.tsx";
import { TimerPreset } from "../app/types.ts";

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

  return (
    <BaseLayout>
      <div className={classes["create-page"]}>
        <header>
          <button
            type="button"
            onClick={goBack}
          >
            <MoveLeft size={24} />
          </button>
          <button
            type="button"
            onClick={savePreset}
          >
            <Save size={24} />
          </button>
        </header>
        <PresetEditor preset={preset} onChange={setPreset} />
      </div>
    </BaseLayout>
  );
}
