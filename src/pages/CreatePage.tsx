import { useCallback, useState } from "react";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "../lib/box/mod.ts";
import { useNavigateTransition } from "../utils/transition.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPresetAdd } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { PresetTitleEditor } from "../components/PresetTitleEditor.tsx";
import { TitleBar } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function CreatePage() {
  const navigate = useNavigateTransition();
  const doPresetAdd = useAppPresetAdd();

  const [preset, setPreset] = useState<TimerPreset>({
    id: crypto.randomUUID(),
    name: "New Preset",
    root: {
      kind: "sequence",
      elements: [
        {
          kind: "loop",
          count: 4,
          element: {
            kind: "sequence",
            elements: [
              { kind: "period", seconds: 60, name: "Work" },
              { kind: "period", seconds: 60, name: "Rest" },
            ],
          },
        },
      ],
    },
  });

  const savePreset = useCallback(() => {
    doPresetAdd(preset);
    navigate("/");
  }, [navigate, doPresetAdd, preset]);

  return (
    <BaseLayout>
      <TitleBar
        left={
          <IconButton
            icon={MoveLeft}
            href="/"
            transitions={["from-right-backwards"]}
          />
        }
        middle={
          <PresetTitleEditor preset={preset} autoFocus onChange={setPreset} />
        }
        right={<IconButton icon={Save} onClick={savePreset} />}
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        className={stylesAll["content-frame"]}
      >
        <PresetEditor preset={preset} onChange={setPreset} />
      </VFrame>
    </BaseLayout>
  );
}
