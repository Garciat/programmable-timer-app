import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "../lib/box/mod.ts";
import { useNavigateTransition } from "../utils/transition.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPreset } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { PresetTitleEditor } from "../components/PresetTitleEditor.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

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

  const savePreset = useCallback(() => {
    if (editedPreset) {
      setPreset(editedPreset);
    }
    navigate("/");
  }, [navigate, setPreset, editedPreset]);

  return (
    <BaseLayout>
      <TitleBar
        left={<IconButton icon={MoveLeft} href="/" />}
        middle={editedPreset
          ? (
            <PresetTitleEditor
              preset={editedPreset}
              onChange={setEditedPreset}
            />
          )
          : <TitleBarText value="Not Found" />}
        right={<IconButton icon={Save} onClick={savePreset} />}
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        className={stylesAll["content-frame"]}
      >
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
