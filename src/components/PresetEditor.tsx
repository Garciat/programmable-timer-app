import { Minus, Plus, Repeat } from "lucide-react";

import {
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerPreset,
  TimerSequence,
} from "../app/types.ts";
import { formatSeconds } from "../utils/time.ts";

import classes from "./PresetEditor.module.css";

export interface PresetEditorProps {
  preset: TimerPreset;
  onChange: (preset: TimerPreset) => void;
}

export function PresetEditor(
  { preset, onChange }: PresetEditorProps,
) {
  function updateRoot(root: TimerSequence) {
    onChange({ ...preset, root });
  }

  return (
    <div className={classes["preset-editor"]}>
      <SequenceEditor timer={preset.root} onChange={updateRoot} />
    </div>
  );
}

interface TimerEditorProps<T extends TimerElement = TimerElement> {
  timer: T;
  onChange: (timer: T) => void;
}

function TimerEditor(
  { timer, onChange }: TimerEditorProps,
) {
  switch (timer.kind) {
    case "sequence":
      return <SequenceEditor timer={timer} onChange={onChange} />;
    case "loop":
      return <LoopEditor timer={timer} onChange={onChange} />;
    case "period":
      return <PeriodEditor timer={timer} onChange={onChange} />;
  }
}

function SequenceEditor(
  { timer, onChange }: TimerEditorProps<TimerSequence>,
) {
  function updateElement(index: number, element: TimerElement) {
    const elements = [...timer.elements];
    elements[index] = element;
    onChange({ ...timer, elements });
  }

  return (
    <div className="sequence-editor">
      {timer.elements.map((element, index) => (
        <TimerEditor
          key={index}
          timer={element}
          onChange={(newElement) => updateElement(index, newElement)}
        />
      ))}
    </div>
  );
}

function LoopEditor(
  { timer, onChange }: TimerEditorProps<TimerLoop>,
) {
  function updateCount(count: number) {
    onChange({ ...timer, count });
  }

  function updateElement(newElement: TimerElement) {
    onChange({ ...timer, element: newElement });
  }

  return (
    <div className={classes["loop-editor"]}>
      <header className={classes["loop-editor-header"]}>
        <div className={classes["loop-editor-label"]}>
          <Repeat size={16} />
        </div>
        <NumberEditor value={timer.count} onChange={updateCount} />
      </header>
      <TimerEditor
        timer={timer.element}
        onChange={(newElement) => updateElement(newElement)}
      />
    </div>
  );
}

function PeriodEditor(
  { timer, onChange }: TimerEditorProps<TimerPeriod>,
) {
  function updateName(name: string) {
    onChange({ ...timer, name });
  }

  function updateSeconds(seconds: number) {
    onChange({ ...timer, seconds });
  }

  return (
    <div className={classes["period-editor"]}>
      <input
        type="text"
        value={timer.name}
        onChange={(event) => updateName(event.target.value)}
      />
      <SecondsEditor value={timer.seconds} onChange={updateSeconds} />
    </div>
  );
}

function SecondsEditor(
  { value, onChange }: { value: number; onChange: (value: number) => void },
) {
  return (
    <div className={classes["seconds-editor"]}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className={classes["seconds-editor-button"]}
      >
        <Minus size={16} />
      </button>
      <div className={classes["seconds-editor-value"]}>
        {formatSeconds(value)}
      </div>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={classes["seconds-editor-button"]}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function NumberEditor(
  { value, onChange }: { value: number; onChange: (value: number) => void },
) {
  return (
    <div className={classes["number-editor"]}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className={classes["number-editor-button"]}
      >
        <Minus size={16} />
      </button>
      <div className={classes["number-editor-value"]}>
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={classes["number-editor-button"]}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
