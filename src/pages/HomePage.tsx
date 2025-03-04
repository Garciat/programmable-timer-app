import { Calculator, Menu, Plus, Timer } from "lucide-react";

import { VFrame } from "lib/box/mod.ts";
import { useAppPresets } from "src/state/context.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { PresetList } from "src/components/PresetList.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function HomePage() {
  const presets = useAppPresets();

  return (
    <BaseLayout>
      <TitleBar
        left={
          <IconButton
            icon={Menu}
            href="/settings"
            transitions={["from-left"]}
          />
        }
        middle={
          <>
            <Calculator size={24} />
            <Timer size={24} />
          </>
        }
        right={
          <IconButton
            icon={Plus}
            href="/new"
            transitions={["from-right"]}
          />
        }
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        className={stylesAll["content-frame"]}
      >
        <PresetList presets={presets} />
        {presets.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No presets yet. Click the plus button to create one.
          </p>
        )}
      </VFrame>
    </BaseLayout>
  );
}
