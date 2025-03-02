import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { useAppPresets } from "../state/context.tsx";
import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetList } from "../components/PresetList.tsx";
import { TitleBar } from "../components/TitleBar.tsx";

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
        <TitleBar middle={<h1>Programmable Timer</h1>} right={createButton} />
        <PresetList presets={presets} />
      </div>
    </BaseLayout>
  );
}
