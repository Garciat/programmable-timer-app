import { contrastForegroundColor } from "../utils/color.ts";
import { FlatTimerPeriod, PlayerAction } from "./types.ts";

export function actionsAtTime(
  periods: readonly FlatTimerPeriod[],
  time: number,
): { done: boolean; actions: PlayerAction[] } {
  const { done, index, elapsedBefore } = indexOfTime(periods, time);
  if (done) {
    return {
      done: true,
      actions: [{ kind: "finished" }],
    };
  } else {
    return {
      done: false,
      actions: actionsForPeriodAtRelativeTime(
        periods[index],
        time - elapsedBefore,
      ),
    };
  }
}

export function timeForRelativePeriod(
  periods: readonly FlatTimerPeriod[],
  time: number,
  offset: number,
): number {
  const { index } = indexOfTime(periods, time);
  return startTimeForPeriod(periods, index + offset);
}

function indexOfTime(
  periods: readonly FlatTimerPeriod[],
  time: number,
): { done: boolean; index: number; elapsedBefore: number } {
  let elapsed = 0;
  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    if (elapsed + period.source.seconds > time) {
      return { done: false, index: i, elapsedBefore: elapsed };
    }
    elapsed += period.source.seconds;
  }
  return { done: true, index: periods.length, elapsedBefore: elapsed };
}

function startTimeForPeriod(
  periods: readonly FlatTimerPeriod[],
  index: number,
) {
  return periods.slice(0, Math.max(0, index)).reduce(
    (acc, period) => acc + period.source.seconds,
    0,
  );
}

function actionsForPeriodAtRelativeTime(
  period: FlatTimerPeriod,
  time: number,
): PlayerAction[] {
  const remainingTime = period.source.seconds - time;

  const round = period.contexts
    .flatMap((context) => context.kind === "loop" ? [context] : [])
    .map((context) => `${context.iteration + 1} / ${context.source.count}`)
    .findLast(() => true);

  const actions: PlayerAction[] = [
    {
      kind: "display",
      round: round,
      text: period.source.name,
      seconds: remainingTime,
      backgroundColor: period.source.color,
      textColor: period.source.color &&
        contrastForegroundColor(period.source.color),
    },
  ];

  if (time === 0) {
    actions.push({
      kind: "speak",
      id: crypto.randomUUID(),
      text: period.source.name,
    });
  } else if (remainingTime <= 3) {
    actions.push({
      kind: "beep",
      id: crypto.randomUUID(),
    });
  }

  return actions;
}
