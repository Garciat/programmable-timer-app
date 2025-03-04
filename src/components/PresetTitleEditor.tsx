import { useCallback } from "react";

import { TimerPreset } from "src/app/types.ts";

import classes from "./PresetTitleEditor.module.css";

export interface PresetTitleEditorProps {
  preset: TimerPreset;
  autoFocus?: boolean;
  onChange: (preset: TimerPreset) => void;
}

export function PresetTitleEditor(
  { preset, autoFocus, onChange }: PresetTitleEditorProps,
) {
  const updateName = useCallback((name: string) => {
    onChange({ ...preset, name });
  }, [onChange, preset]);

  return (
    <input
      type="text"
      autoFocus={autoFocus}
      value={preset.name}
      onChange={(e) => updateName(e.target.value)}
      className={classes["title-input"]}
    />
  );
}
