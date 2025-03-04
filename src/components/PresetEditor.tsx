import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Palette,
  Plus,
  Repeat,
  Trash2,
} from "lucide-react";

import { HStack } from "../lib/box/mod.ts";
import { contrastForegroundColor } from "../utils/color.ts";
import { formatSeconds } from "../utils/time.ts";
import { clamp } from "../utils/number.ts";
import { PERIOD_TIME_MAX, PERIOD_TIME_MIN } from "../app/constants.ts";
import {
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerPreset,
  TimerSequence,
} from "../app/types.ts";
import { duration } from "../app/flatten.ts";

import classes from "./PresetEditor.module.css";

export interface PresetEditorProps {
  preset: TimerPreset;
  onChange: (preset: TimerPreset) => void;
}

export function PresetEditor(
  { preset, onChange }: PresetEditorProps,
) {
  const updateRoot = useCallback((root: TimerSequence) => {
    onChange({ ...preset, root });
  }, [onChange, preset]);

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
  const updateElement = useCallback((index: number, element: TimerElement) => {
    const elements = [...timer.elements];
    elements[index] = element;
    onChange({ ...timer, elements });
  }, [onChange, timer]);

  const appendNewElement = useCallback(() => {
    onChange({
      ...timer,
      elements: [
        ...timer.elements,
        { kind: "period", name: "Work", seconds: 60 },
      ],
    });
  }, [onChange, timer]);

  const moveElement = useCallback((index: number, offset: number) => {
    const newIndex = index + offset;
    if (newIndex < 0 || newIndex >= timer.elements.length) {
      return;
    }

    const elements = [...timer.elements];
    const [element] = elements.splice(index, 1);
    elements.splice(newIndex, 0, element);
    onChange({ ...timer, elements });
  }, [onChange, timer]);

  const loopElement = useCallback((index: number) => {
    const elements = [...timer.elements];
    const element = elements[index];
    elements[index] = {
      kind: "loop",
      count: 1,
      element: { kind: "sequence", elements: [element] },
    };
    onChange({ ...timer, elements });
  }, [onChange, timer]);

  const removeElement = useCallback((index: number) => {
    const elements = [...timer.elements];
    elements.splice(index, 1);
    onChange({ ...timer, elements });
  }, [onChange, timer]);

  const buttonSize = 16;

  const getItemColor = useCallback((timer: TimerElement) => {
    if (timer.kind === "period" && timer.color) {
      return {
        backgroundColor: timer.color,
        color: contrastForegroundColor(timer.color),
      };
    }
  }, []);

  return (
    <div className={classes["sequence-editor"]}>
      <div className={classes["sequence-editor-items"]}>
        {timer.elements.map((element, index) => (
          <div
            key={index}
            className={classes["sequence-editor-item"]}
            style={{ ...getItemColor(element) }}
          >
            <div className={classes["sequence-editor-item-value"]}>
              <TimerEditor
                timer={element}
                onChange={(newElement) => updateElement(index, newElement)}
              />
            </div>
            <footer>
              <button
                type="button"
                onClick={() => loopElement(index)}
              >
                <Repeat size={buttonSize} />
              </button>
              <button
                type="button"
                onClick={() => removeElement(index)}
              >
                <Trash2 size={buttonSize} />
              </button>
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
            </footer>
          </div>
        ))}
      </div>

      <footer>
        <div className={classes["left"]}></div>
        <button
          type="button"
          onClick={() => appendNewElement()}
        >
          <Plus size={24} />
        </button>
        <div className={classes["right"]}>
          {formatSeconds(duration(timer))}
        </div>
      </footer>
    </div>
  );
}

function LoopEditor(
  { timer, onChange }: TimerEditorProps<TimerLoop>,
) {
  const updateCount = useCallback((count: number) => {
    onChange({ ...timer, count });
  }, [onChange, timer]);

  const updateElement = useCallback((newElement: TimerElement) => {
    onChange({ ...timer, element: newElement });
  }, [onChange, timer]);

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
  const updateName = useCallback((name: string) => {
    onChange({ ...timer, name });
  }, [onChange, timer]);

  const updateSeconds = useCallback((seconds: number) => {
    onChange({
      ...timer,
      seconds: clamp(seconds, PERIOD_TIME_MIN, PERIOD_TIME_MAX),
    });
  }, [onChange, timer]);

  const updateColor = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...timer, color: event.target.value });
    },
    [onChange, timer],
  );

  return (
    <div className={classes["period-editor"]}>
      <HStack gap="0.5rem">
        <input
          type="text"
          value={timer.name}
          onChange={(event) => updateName(event.target.value)}
        />
        <label className={classes["color-picker"]}>
          <Palette size={16} />
          <input
            type="color"
            value={timer.color}
            onChange={updateColor}
            className={classes["color-input"]}
          />
        </label>
      </HStack>

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
  const decrement = useCallback(() => {
    if (value > 1) {
      onChange(value - 1);
    }
  }, [onChange, value]);

  const increment = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  const minutes = useMemo(() => new NumberBox(Math.floor(value / 60)), [value]);
  const seconds = useMemo(() => new NumberBox(value % 60), [value]);

  const setMinutes = useCallback((newMinutes: number) => {
    onChange(newMinutes * 60 + seconds.value);
  }, [onChange, seconds]);

  const setSeconds = useCallback((newSeconds: number) => {
    onChange(minutes.value * 60 + newSeconds);
  }, [onChange, minutes]);

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
        <TimePartInput value={minutes} onChange={setMinutes} />
        <span>:</span>
        <TimePartInput value={seconds} onChange={setSeconds} />
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

// we want newly-computer numbers to trigger re-renders
// didn't use built-in Number because of lint
class NumberBox {
  constructor(public value: number) {}
  toString() {
    return this.value.toString();
  }
}

interface TimePartInputProps {
  value: NumberBox;
  onChange: (value: number) => void;
}

function TimePartInput({ value, onChange }: TimePartInputProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(value.toString().padStart(2, "0"));
  }, [value]);

  const update = useCallback((value: string) => {
    if (value.length <= 2) {
      setText(value);
    }
  }, []);

  const commit = useCallback(() => {
    const newValue = parseInt(text, 10);
    if (isNaN(newValue) || newValue === value.value) {
      // reset to previous value
      return setText(value.toString().padStart(2, "0"));
    } else {
      // send new value
      return onChange(newValue);
    }
  }, [onChange, text, value]);

  return (
    <input
      type="number"
      inputMode="numeric"
      value={text}
      onChange={(event) => update(event.target.value)}
      onBlur={commit}
      onFocus={(event) => event.target.select()}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          commit();
          (event.target as HTMLInputElement).blur();
        }
      }}
      className={classes["time-part-input"]}
    />
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
  const decrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [onChange, value, min]);

  const increment = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

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
