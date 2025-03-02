import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { useAppPreset } from "../state/context.tsx";

import classes from "./EditPage.module.css";

export function EditPage() {
  const navigate = useNavigate();

  const { presetId } = useParams();
  const [savedPreset, setSavedPreset] = useAppPreset(presetId ?? "");

  const [preset, setPreset] = useState(savedPreset);

  useEffect(() => {
    if (!savedPreset) {
      navigate("/");
    }
  }, [savedPreset, navigate]);

  function goBack() {
    navigate("/");
  }

  function savePreset() {
    if (preset) {
      setSavedPreset(preset);
    }
    navigate("/");
  }

  return (
    <BaseLayout>
      <div className={classes["edit-page"]}>
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
        {preset && <PresetEditor preset={preset} onChange={setPreset} />}
      </div>
    </BaseLayout>
  );
}
