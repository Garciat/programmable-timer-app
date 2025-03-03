import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "../lib/box/VFrame.tsx";
import { useNavigateTransition } from "../utils/transition.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPreset } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { NavButton } from "../components/NavButton.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";
import classes from "./Editor.module.css";

export function EditPage() {
  const navigate = useNavigateTransition();

  const { presetId } = useParams();
  const [preset, setPreset] = useAppPreset(presetId ?? "");

  const [editedPreset, setEditedPreset] = useState<TimerPreset | undefined>(
    undefined,
  );

  useEffect(() => {
    setEditedPreset(preset);
  }, [preset]);

  function updateName(name: string) {
    setEditedPreset((prev) => prev && { ...prev, name });
  }

  function savePreset() {
    if (editedPreset) {
      setPreset(editedPreset);
    }
    navigate("/");
  }

  const titleEditor = editedPreset &&
    (
      <input
        type="text"
        value={editedPreset.name}
        onChange={(e) => updateName(e.target.value)}
        className={classes["title-input"]}
      />
    );

  return (
    <BaseLayout>
      <TitleBar
        left={<NavButton icon={MoveLeft} href="/" />}
        middle={titleEditor ?? <TitleBarText value="Not Found" />}
        right={<NavButton icon={Save} onClick={savePreset} />}
      />
      <VFrame className={stylesAll["content-frame"]}>
        {editedPreset
          ? <PresetEditor preset={editedPreset} onChange={setEditedPreset} />
          : (
            <p style={{ textAlign: "center" }}>
              This preset does not exist.
            </p>
          )}
      </VFrame>
    </BaseLayout>
  );
}
