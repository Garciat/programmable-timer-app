import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Repeat,
  Trash2,
} from "lucide-react";

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
  function updateName(name: string) {
    onChange({ ...preset, name });
  }

  function updateRoot(root: TimerSequence) {
    onChange({ ...preset, root });
  }

  return (
    <div className={classes["preset-editor"]}>
      <header>
        <input
          type="text"
          value={preset.name}
          onChange={(event) => updateName(event.target.value)}
        />
      </header>
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

  function appendNewElement() {
    onChange({
      ...timer,
      elements: [
        ...timer.elements,
        { kind: "period", name: "New entry", seconds: 60 },
      ],
    });
  }

  function moveElement(index: number, offset: number) {
    const newIndex = index + offset;
    if (newIndex < 0 || newIndex >= timer.elements.length) {
      return;
    }

    const elements = [...timer.elements];
    const [element] = elements.splice(index, 1);
    elements.splice(newIndex, 0, element);
    onChange({ ...timer, elements });
  }

  function loopElement(index: number) {
    const elements = [...timer.elements];
    const element = elements[index];
    elements[index] = {
      kind: "loop",
      count: 1,
      element: { kind: "sequence", elements: [element] },
    };
    onChange({ ...timer, elements });
  }

  function removeElement(index: number) {
    const elements = [...timer.elements];
    elements.splice(index, 1);
    onChange({ ...timer, elements });
  }

  const buttonSize = 16;

  return (
    <div className={classes["sequence-editor"]}>
      {timer.elements.map((element, index) => (
        <div key={index} className={classes["sequence-editor-item"]}>
          <div className={classes["sequence-editor-item-controls"]}>
            <button
              type="button"
              onClick={() =>
                loopElement(index)}
            >
              <Repeat size={buttonSize} />
            </button>
            <button
              type="button"
              onClick={() =>
                removeElement(index)}
            >
              <Trash2 size={buttonSize} />
            </button>
          </div>
          <div className={classes["sequence-editor-item-value"]}>
            <TimerEditor
              timer={element}
              onChange={(newElement) => updateElement(index, newElement)}
            />
          </div>
          <div className={classes["sequence-editor-item-controls"]}>
            <button
              type="button"
              onClick={() => moveElement(index, -1)}
            >
              <ChevronUp size={buttonSize} />
            </button>
            <button
              type="button"
              onClick={() => moveElement(index, 1)}
            >
              <ChevronDown size={buttonSize} />
            </button>
          </div>
        </div>
      ))}

      <div className={classes["sequence-editor-add"]}>
        <button
          type="button"
          onClick={() => appendNewElement()}
        >
          <Plus size={24} />
        </button>
      </div>
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
        <NumberEditor value={timer.count} min={1} onChange={updateCount} />
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

interface SecondsEditorProps {
  value: number;
  onChange: (value: number) => void;
}

function SecondsEditor(
  { value, onChange }: SecondsEditorProps,
) {
  function decrement() {
    if (value > 1) {
      onChange(value - 1);
    }
  }

  function increment() {
    onChange(value + 1);
  }

  return (
    <div className={classes["seconds-editor"]}>
      <button
        type="button"
        onClick={decrement}
        className={classes["seconds-editor-button"]}
      >
        <Minus size={16} />
      </button>
      <div className={classes["seconds-editor-value"]}>
        {formatSeconds(value)}
      </div>
      <button
        type="button"
        onClick={increment}
        className={classes["seconds-editor-button"]}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

interface NumberEditorProps {
  value: number;
  min: number;
  onChange: (value: number) => void;
}

function NumberEditor(
  { value, min, onChange }: NumberEditorProps,
) {
  function decrement() {
    if (value > min) {
      onChange(value - 1);
    }
  }

  function increment() {
    onChange(value + 1);
  }

  return (
    <div className={classes["number-editor"]}>
      <button
        type="button"
        onClick={decrement}
        className={classes["number-editor-button"]}
      >
        <Minus size={16} />
      </button>
      <div className={classes["number-editor-value"]}>
        {value}
      </div>
      <button
        type="button"
        onClick={increment}
        className={classes["number-editor-button"]}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
