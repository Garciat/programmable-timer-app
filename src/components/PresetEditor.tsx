import {
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerPreset,
  TimerSequence,
} from "../app/types.ts";

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
    <div className="preset-editor">
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
  function updateElement(newElement: TimerElement) {
    onChange({ ...timer, element: newElement });
  }

  return (
    <div className="loop-editor">
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
    <div className="period-editor">
      <input
        type="text"
        value={timer.name}
        onChange={(event) => updateName(event.target.value)}
      />
      <input
        type="number"
        min={1}
        value={timer.seconds}
        onChange={(event) => updateSeconds(Number(event.target.value))}
      />
    </div>
  );
}
