import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "../lib/box/VFrame.tsx";
import { useNavigateTransition } from "../utils/transition.ts";
import { decodeShare } from "../app/share.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPresetAdd } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { PresetTitleEditor } from "../components/PresetTitleEditor.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

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
    <BaseLayout>
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
          ? <PresetEditor preset={preset} onChange={setPreset} />
          : <p style={{ textAlign: "center" }}>This share link is invalid.</p>}
      </VFrame>
    </BaseLayout>
  );
}
