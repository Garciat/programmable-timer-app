import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { useAppPresets } from "../state/context.tsx";
import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetList } from "../components/PresetList.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import classes from "./HomePage.module.css";

export function HomePage() {
  const navigate = useNavigate();

  const presets = useAppPresets();

  function createPreset() {
    navigate("/new");
  }

  const createButton = (
    <button type="button" onClick={() => createPreset()}>
      <Plus size={24} />
    </button>
  );

  return (
    <BaseLayout>
      <div className={classes["home-page"]}>
        <TitleBar
          middle={<TitleBarText value="Programmable Timer" />}
          right={createButton}
        />
        <PresetList presets={presets} />
        {presets.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No presets yet. Click the plus button to create one.
          </p>
        )}
      </div>
    </BaseLayout>
  );
}
