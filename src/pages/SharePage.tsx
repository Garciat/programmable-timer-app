import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "lib/box/mod.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";
import { decodeShare } from "src/app/share.ts";
import { TimerPreset } from "src/app/types.ts";
import { useAppPresetAdd } from "src/state/context.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { PresetEditor } from "src/components/PresetEditor.tsx";
import { PresetTitleEditor } from "src/components/PresetTitleEditor.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";

export function SharePage() {
  const navigate = useNavigateTransition();
  const { content } = useParams();
  const doPresetAdd = useAppPresetAdd();

  const [preset, setPreset] = useState<TimerPreset | undefined>(undefined);

  useEffect(() => {
    if (content) {
      decodeShare(content).then(setPreset);
    }
  }, [content]);

  const savePreset = useCallback(() => {
    if (preset) {
      doPresetAdd(preset);
    }
    navigate("/");
  }, [navigate, doPresetAdd, preset]);

  return (
    <BaseLayout title="Shared Timer">
      <TitleBar
        left={<IconButton icon={MoveLeft} href="/" />}
        middle={preset
          ? <PresetTitleEditor preset={preset} onChange={setPreset} />
          : <TitleBarText value="Invalid Share" />}
        right={<IconButton icon={Save} onClick={savePreset} />}
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        className={stylesAll["content-frame"]}
      >
        {preset
          ? (
            <>
              <p>
                This timer preset has been shared with you. You may save it into
                your personal presets with the <Save size={12} />{" "}
                button above. You may also edit the preset below before saving
                it.
              </p>
              <PresetEditor preset={preset} onChange={setPreset} />
            </>
          )
          : <p style={{ textAlign: "center" }}>This share link is invalid.</p>}
      </VFrame>
    </BaseLayout>
  );
}
