import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { useAppPreset } from "../state/context.tsx";
import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import classes from "./EditPage.module.css";
import { TimerPreset } from "../app/types.ts";

export function EditPage() {
  const navigate = useNavigate();

  const { presetId } = useParams();
  const [preset, setPreset] = useAppPreset(presetId ?? "");

  const [editedPreset, setEditedPreset] = useState<TimerPreset | undefined>(
    undefined,
  );

  useEffect(() => {
    setEditedPreset(preset);
  }, [preset]);

  function goBack() {
    navigate("/");
  }

  function updateName(name: string) {
    setEditedPreset((prev) => prev && { ...prev, name });
  }

  function savePreset() {
    if (editedPreset) {
      setPreset(editedPreset);
    }
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

  const titleEditor = editedPreset &&
    (
      <input
        type="text"
        value={editedPreset.name}
        onChange={(e) => updateName(e.target.value)}
        className={classes["title-editor"]}
      />
    );

  return (
    <BaseLayout>
      <div className={classes["edit-page"]}>
        <TitleBar
          left={backButton}
          middle={titleEditor ?? <TitleBarText value="Not Found" />}
          right={saveButton}
        />
        {editedPreset
          ? <PresetEditor preset={editedPreset} onChange={setEditedPreset} />
          : <p style={{ textAlign: "center" }}>This preset does not exist.</p>}
      </div>
    </BaseLayout>
  );
}
