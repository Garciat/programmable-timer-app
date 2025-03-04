import { HFrame } from "../lib/box/HFrame.tsx";
import { HStack } from "../lib/box/HStack.tsx";
import { VStack } from "../lib/box/VStack.tsx";
import { formatSeconds } from "../utils/time.ts";
import {
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerPreset,
  TimerSequence,
} from "../app/types.ts";

import classes from "./PresetDisplay.module.css";

export function PresetDisplay(props: { preset: TimerPreset }) {
  const { preset } = props;

  return (
    <HFrame gap="0.5rem">
      <TimerDisplay timer={preset.root} />
    </HFrame>
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
    <HStack className={classes["loop-display"]}>
      <VStack kind="header" justify="center">
        <span>{`${loop.count}x`}</span>
      </VStack>
      <TimerDisplay timer={loop.element} />
    </HStack>
  );
}

function PeriodDisplay(props: { period: TimerPeriod }) {
  const { period } = props;

  return (
    <VStack
      alignItems="center"
      justify="center"
      className={classes["period-display"]}
    >
      <header>{period.name}</header>
      <footer>{formatSeconds(period.seconds)}</footer>
    </VStack>
  );
}
