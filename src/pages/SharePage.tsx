import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VStack } from "../lib/box/VStack.tsx";
import { decodeShare } from "../app/share.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPresetAdd } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import classes from "./CreatePage.module.css";

export function SharePage() {
  const navigate = useNavigate();
  const { content } = useParams();
  const doPresetAdd = useAppPresetAdd();

  const [preset, setPreset] = useState<TimerPreset | undefined>(undefined);

  useEffect(() => {
    if (content) {
      decodeShare(content).then(setPreset);
    }
  }, [content]);

  function goBack() {
    navigate("/");
  }

  function savePreset() {
    if (preset) {
      doPresetAdd(preset);
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

  const titleEditor = preset && (
    <input
      type="text"
      value={preset.name}
      onChange={(e) => setPreset({ ...preset, name: e.target.value })}
      className={classes["title-editor"]}
    />
  );

  return (
    <BaseLayout>
      <VStack className={classes["create-page"]}>
        <TitleBar
          left={backButton}
          middle={titleEditor ?? <TitleBarText value="Invalid Share" />}
          right={saveButton}
        />
        {preset
          ? <PresetEditor preset={preset} onChange={setPreset} />
          : <p style={{ textAlign: "center" }}>This share link is invalid.</p>}
      </VStack>
    </BaseLayout>
  );
}
