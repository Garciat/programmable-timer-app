import {
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerPreset,
  TimerSequence,
} from "../app/types.ts";
import { formatSeconds } from "../utils/time.ts";

import "./PresetDisplay.css";

export function PresetDisplay(props: { preset: TimerPreset }) {
  const { preset } = props;

  return (
    <div className="preset-display">
      <TimerDisplay timer={preset.root} />
    </div>
  );
}

function TimerDisplay(props: { timer: TimerElement }) {
  const { timer } = props;

  switch (timer.kind) {
    case "sequence":
      return <SequenceDisplay sequence={timer} />;
    case "loop":
      return <LoopDisplay loop={timer} />;
    case "period":
      return <PeriodDisplay period={timer} />;
  }
}

function SequenceDisplay(props: { sequence: TimerSequence }) {
  const { sequence } = props;

  return (
    <>
      {sequence.elements.map((element, index) => (
        <TimerDisplay key={index} timer={element} />
      ))}
    </>
  );
}

function LoopDisplay(props: { loop: TimerLoop }) {
  const { loop } = props;

  return (
    <div className="loop-display">
      <header>{`${loop.count}x`}</header>
      <TimerDisplay timer={loop.element} />
    </div>
  );
}

function PeriodDisplay(props: { period: TimerPeriod }) {
  const { period } = props;

  return (
    <article className="period-display">
      <header>{period.name}</header>
      <footer>{formatSeconds(period.seconds)}</footer>
    </article>
  );
}
