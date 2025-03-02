import { useNavigate } from "react-router";
import { Pencil, Play, Trash2 } from "lucide-react";

import { duration } from "../app/flatten.ts";
import { TimerPreset } from "../app/types.ts";
import { formatSeconds } from "../utils/time.ts";
import { PresetDisplay } from "./PresetDisplay.tsx";

import classes from "./PresetList.module.css";
import { useAppPresetDelete } from "../state/context.tsx";

export interface PresetListProps {
  presets: TimerPreset[];
}

export function PresetList({ presets }: PresetListProps) {
  const navigate = useNavigate();
  const doDelete = useAppPresetDelete();

  function editPreset(preset: TimerPreset) {
    navigate(`/edit/${preset.id}`);
  }

  function deletePreset(preset: TimerPreset) {
    if (globalThis.confirm(`Delete preset "${preset.name}"?`)) {
      doDelete(preset.id);
    }
  }

  function playPreset(preset: TimerPreset) {
    console.log("Play preset", preset);
  }

  const buttonSize = 24;

  return (
    <div className={classes["preset-list"]}>
      {presets.map((preset) => (
        <div key={preset.id} className={classes["preset-list-item"]}>
          <header>
            <span className={classes["preset-list-item-name"]}>
              {preset.name}
            </span>
            <span className={classes["preset-list-item-duration"]}>
              {formatSeconds(duration(preset.root))}
            </span>
          </header>
          <PresetDisplay preset={preset} />
          <footer>
            <div className={classes["preset-list-item-actions"]}>
              <button
                type="button"
                onClick={() =>
                  editPreset(preset)}
              >
                <Pencil size={buttonSize} />
              </button>
              <button
                type="button"
                onClick={() =>
                  deletePreset(preset)}
              >
                <Trash2 size={buttonSize} />
              </button>
            </div>
            <div className={classes["preset-list-item-actions"]}>
              <button type="button" onClick={() => playPreset(preset)}>
                <Play size={buttonSize} />
              </button>
            </div>
          </footer>
        </div>
      ))}
    </div>
  );
}
