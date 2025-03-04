import { HFrame, HStack, VStack } from "lib/box/mod.ts";
import { contrastForegroundColor } from "lib/utils/color.ts";
import { formatSeconds } from "lib/utils/time.ts";
import {
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerPreset,
  TimerSequence,
} from "src/app/types.ts";

import classes from "./PresetDisplay.module.css";

export function PresetDisplay(props: { preset: TimerPreset }) {
  const { preset } = props;

  return (
    <HFrame justify="flex-start" gap="0.5rem">
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
    <HStack alignItems="stretch" className={classes["loop-display"]}>
      <VStack kind="header">
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
      className={classes["period-display"]}
      style={{
        backgroundColor: period.color,
        color: period.color && contrastForegroundColor(period.color),
      }}
    >
      <header>{period.name}</header>
      <footer>{formatSeconds(period.seconds)}</footer>
    </VStack>
  );
}
