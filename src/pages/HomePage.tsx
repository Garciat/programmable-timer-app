import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { useAppPresets } from "../state/context.tsx";
import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetList } from "../components/PresetList.tsx";

import classes from "./HomePage.module.css";

export function HomePage() {
  const navigate = useNavigate();

  const presets = useAppPresets();

  function createPreset() {
    navigate("/new");
  }

  return (
    <BaseLayout>
      <div className={classes["home-page"]}>
        <header>
          <h1>Programmable Timer</h1>
          <div className={classes["header-actions"]}>
            <button type="button" onClick={() => createPreset()}>
              <Plus size={24} />
            </button>
          </div>
        </header>
        <PresetList presets={presets} />
      </div>
    </BaseLayout>
  );
}
