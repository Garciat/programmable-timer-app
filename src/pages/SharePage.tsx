import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "../lib/box/VFrame.tsx";
import { useNavigateTransition } from "../utils/transition.ts";
import { decodeShare } from "../app/share.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPresetAdd } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { NavButton } from "../components/NavButton.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";
import classes from "./Editor.module.css";

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

  function goBack() {
    navigate("/");
  }

  function savePreset() {
    if (preset) {
      doPresetAdd(preset);
    }
    navigate("/");
  }

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
      <TitleBar
        left={<NavButton icon={MoveLeft} onClick={goBack} />}
        middle={titleEditor ?? <TitleBarText value="Invalid Share" />}
        right={<NavButton icon={Save} onClick={savePreset} />}
      />
      <VFrame className={stylesAll["content-frame"]}>
        {preset
          ? <PresetEditor preset={preset} onChange={setPreset} />
          : <p style={{ textAlign: "center" }}>This share link is invalid.</p>}
      </VFrame>
    </BaseLayout>
  );
}
