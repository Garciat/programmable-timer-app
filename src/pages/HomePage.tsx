import { Calculator, Menu, Plus, Timer } from "lucide-react";

import { VFrame } from "lib/box/mod.ts";
import { useAppPresets } from "src/state/context.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { MainNav } from "src/components/MainNav.tsx";
import { PresetList } from "src/components/PresetList.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { routeNewPreset, routeSettings } from "src/routes.ts";

import stylesAll from "src/pages/all.module.css";

export function HomePage() {
  const presets = useAppPresets();

  return (
    <BaseLayout title="Programmable Timer">
      <TitleBar
        left={
          <IconButton
            icon={Menu}
            href={routeSettings()}
            transitions={["from-left"]}
          />
        }
        middle={
          <>
            <Calculator size="1.5rem" />
            <Timer size="1.5rem" />
          </>
        }
        right={
          <IconButton
            icon={Plus}
            href={routeNewPreset()}
            transitions={["from-right"]}
          />
        }
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        gap="2rem"
        className={stylesAll["content-frame"]}
      >
        {presets.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No presets yet. Click the plus button to create one.
          </p>
        )}
        <PresetList presets={presets} />
      </VFrame>
      <MainNav />
    </BaseLayout>
  );
}
