import { useCallback, useState } from "react";
import { MoveLeft, Save } from "lucide-react";

import { VFrame } from "lib/box/mod.ts";
import { useNavigateTransition } from "src/utils/transition.ts";
import { TimerPreset } from "src/app/types.ts";
import { useAppPresetAdd } from "src/state/context.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { PresetEditor } from "src/components/PresetEditor.tsx";
import { PresetTitleEditor } from "src/components/PresetTitleEditor.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";

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
