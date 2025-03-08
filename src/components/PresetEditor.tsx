import { useCallback, useEffect, useMemo, useState } from "react";
import { Minus, Palette, Plus, Repeat, Settings } from "lucide-react";

import { HStack } from "lib/box/mod.ts";
import { contrastForegroundColor } from "lib/utils/color.ts";
import { formatSeconds } from "lib/utils/time.ts";
import { clamp } from "lib/utils/number.ts";
import { PERIOD_TIME_MAX, PERIOD_TIME_MIN } from "src/app/constants.ts";
import {
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerPreset,
  TimerSequence,
} from "src/app/types.ts";
import { duration } from "src/app/flatten.ts";

import classes from "src/components/PresetEditor.module.css";
import { IconButton } from "src/components/IconButton.tsx";
import { IconMenu } from "src/components/IconMenu.tsx";

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
      count: 2,
      element: { kind: "sequence", elements: [element] },
    };
    onChange({ ...timer, elements });
  }, [onChange, timer]);

  const unloopElement = useCallback((index: number) => {
    const elements = [...timer.elements];
    const loop = elements[index];
    if (loop.kind !== "loop") {
      return;
    }
    if (loop.element.kind !== "sequence") {
      return;
    }
    elements.splice(index, 1, ...loop.element.elements);
    onChange({ ...timer, elements });
  }, [onChange, timer]);

  const removeElement = useCallback((index: number) => {
    const elements = [...timer.elements];
    elements.splice(index, 1);
    onChange({ ...timer, elements });
  }, [onChange, timer]);

  return (
    <div className={classes["sequence-editor"]}>
      <div className={classes["sequence-editor-items"]}>
        {timer.elements.map((element, index) => (
          <SequenceItemEditor
            key={index}
            timer={element}
            onLoop={() => loopElement(index)}
            onUnloop={() => unloopElement(index)}
            onRemove={() => removeElement(index)}
            onMoveUp={() => moveElement(index, -1)}
            onMoveDown={() => moveElement(index, 1)}
            onChange={(newElement) => updateElement(index, newElement)}
          />
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

interface SequenceItemEditorProps {
  timer: TimerElement;
  onLoop: () => void;
  onUnloop: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChange: (element: TimerElement) => void;
}

function SequenceItemEditor({
  timer,
  onLoop,
  onUnloop,
  onRemove,
  onMoveUp,
  onMoveDown,
  onChange,
}: SequenceItemEditorProps) {
  const canHaveColor = timer.kind === "period";

  const timerColor = timer.kind === "period" ? timer.color : undefined;

  const timerColorStyle = useMemo(() => {
    if (timerColor) {
      return {
        backgroundColor: timerColor,
        color: contrastForegroundColor(timerColor),
      };
    }
  }, [timerColor]);

  const unloopOption = useMemo(() => {
    if (timer.kind === "loop") {
      return [{ label: "Unloop", onSelect: onUnloop }];
    }
    return [];
  }, [timer.kind, onUnloop]);

  const setItemColor = useCallback((value: string) => {
    if (timer.kind !== "period") {
      return;
    }
    onChange({ ...timer, color: value });
  }, [onChange, timer]);

  return (
    <div
      className={classes["sequence-editor-item"]}
      style={{ ...timerColorStyle }}
    >
      <div className={classes["sequence-editor-item-value"]}>
        <TimerEditor timer={timer} onChange={onChange} />
      </div>
      <footer>
        <HStack gap="0.5rem">
          {/* I tried to move the color option under the IconMenu */}
          {/* But I couldn't make it work on iOS, unfortunately. */}
          {canHaveColor && (
            <label className={classes["color-picker"]}>
              <Palette className={classes["icon"]} />
              <input
                type="color"
                defaultValue={timer.color}
                onChange={(event) => setItemColor(event.target.value)}
                className={classes["color-input"]}
              />
            </label>
          )}
          <IconMenu icon={Settings} title="Options">
            {[
              ...unloopOption,
              { label: "Loop", onSelect: onLoop },
              { label: "Move up", onSelect: onMoveUp },
              { label: "Move down", onSelect: onMoveDown },
              { label: "Remove", onSelect: onRemove },
            ]}
          </IconMenu>
        </HStack>
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
          <Repeat size={24} />
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
      <div className={classes["seconds-editor-value"]}>
        <TimePartInput value={minutes} onChange={setMinutes} />
        <span className={classes["separator"]}>:</span>
        <TimePartInput value={seconds} onChange={setSeconds} />
      </div>
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
      <IconButton icon={Minus} onClick={decrement} />
      <div className={classes["number-editor-value"]}>
        {value}
      </div>
      <IconButton icon={Plus} onClick={increment} />
    </div>
  );
}
