import { useNavigate } from "react-router";
import { Pencil, Play, Share, Trash2 } from "lucide-react";

import { useAudioContext } from "../lib/audio/context.tsx";
import { formatSeconds } from "../utils/time.ts";
import { duration } from "../app/flatten.ts";
import { encodeShare } from "../app/share.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPresetDelete } from "../state/context.tsx";
import { PresetDisplay } from "./PresetDisplay.tsx";

import classes from "./PresetList.module.css";

export interface PresetListProps {
  presets: TimerPreset[];
}

export function PresetList({ presets }: PresetListProps) {
  const navigate = useNavigate();
  const doDelete = useAppPresetDelete();

  const audioContext = useAudioContext();

  function editPreset(preset: TimerPreset) {
    navigate(`/edit/${preset.id}`);
  }

  function deletePreset(preset: TimerPreset) {
    if (globalThis.confirm(`Delete preset "${preset.name}"?`)) {
      doDelete(preset.id);
    }
  }

  async function playPreset(preset: TimerPreset) {
    // We just got a user interaction, so we can resume the audio context.
    await audioContext.resume();
    navigate(`/play/${preset.id}`);
  }

  async function sharePreset(preset: TimerPreset) {
    const content = await encodeShare(preset);

    const url = new URL(globalThis.location.href);
    url.pathname = `/share/${encodeURIComponent(content)}`;

    try {
      await navigator.clipboard.writeText(url.toString());
      globalThis.alert("Copied share link to clipboard.");
      return;
    } catch (error) {
      console.error("Error copying share link to clipboard:", error);
    }

    const shareData = {
      title: `Timer Preset: ${preset.name}`,
      text: `Check out my timer preset: ${preset.name}`,
      url: url.toString(),
    };

    if (navigator.canShare(shareData)) {
      try {
        return await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
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
                  sharePreset(preset)}
              >
                <Share size={buttonSize} />
              </button>
              <button
                type="button"
                onClick={() => deletePreset(preset)}
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
