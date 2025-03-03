import { useNavigate } from "react-router";
import { Calculator, Timer } from "lucide-react";

import { VFrame } from "../lib/box/VFrame.tsx";
import { useAppPresets } from "../state/context.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { NavButton } from "../components/NavButton.tsx";
import { PresetList } from "../components/PresetList.tsx";
import { TitleBar } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function HomePage() {
  const navigate = useNavigate();

  const presets = useAppPresets();

  function openSettings() {
    navigate("/settings");
  }

  function createPreset() {
    navigate("/new");
  }

  return (
    <BaseLayout>
      <TitleBar
        left={<NavButton icon="menu" onClick={openSettings} />}
        middle={
          <>
            <Calculator size={24} />
            <Timer size={24} />
          </>
        }
        right={<NavButton icon="plus" onClick={createPreset} />}
      />
      <VFrame className={stylesAll["content-frame"]}>
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
