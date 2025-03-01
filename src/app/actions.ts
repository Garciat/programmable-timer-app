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
  return { done: true, index: -1, elapsedBefore: elapsed };
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
