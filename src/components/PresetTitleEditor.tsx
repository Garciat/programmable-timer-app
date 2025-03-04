import { useCallback } from "react";

import { TimerPreset } from "../app/types.ts";

import classes from "./PresetTitleEditor.module.css";

export interface PresetTitleEditorProps {
  preset: TimerPreset;
  onChange: (preset: TimerPreset) => void;
}

export function PresetTitleEditor(
  { preset, onChange }: PresetTitleEditorProps,
) {
  const updateName = useCallback((name: string) => {
    onChange({ ...preset, name });
  }, [onChange, preset]);

  return (
    <input
      type="text"
      autoFocus
      value={preset.name}
      onChange={(e) => updateName(e.target.value)}
      className={classes["title-input"]}
    />
  );
}
