import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "lib/box/mod.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";
import { TimerPreset } from "src/app/types.ts";
import { useAppPreset } from "src/state/context.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { PresetEditor } from "src/components/PresetEditor.tsx";
import { PresetTitleEditor } from "src/components/PresetTitleEditor.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";

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

  // maybe use deep-equal?
  const isModified = useMemo(() => {
    if (!editedPreset) {
      return false;
    }
    return JSON.stringify(editedPreset) !== JSON.stringify(preset);
  }, [editedPreset, preset]);

  return (
    <BaseLayout
      title={editedPreset ? `Edit: ${editedPreset.name}` : "Not Found"}
    >
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
        right={
          <IconButton icon={Save} disabled={!isModified} onClick={savePreset} />
        }
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
