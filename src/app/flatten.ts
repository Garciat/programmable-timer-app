import {
  FlatTimerContext,
  FlatTimerPeriod,
  TimerControlElement,
  TimerElement,
  TimerLoop,
  TimerSequence,
} from "./types.ts";

// recursive implementation assumes that user timers are relatively small
export function flatten(root: TimerControlElement): FlatTimerPeriod[] {
  switch (root.kind) {
    case "sequence":
      return flattenSequence(root, []);
    case "loop":
      return flattenLoop(root, []);
  }
}

function flattenTimer(
  timer: TimerElement,
  contexts: FlatTimerContext[],
): FlatTimerPeriod[] {
  switch (timer.kind) {
    case "period":
      return [{
        contexts: [...contexts],
        source: timer,
      }];
    case "sequence":
      return flattenSequence(timer, contexts);
    case "loop":
      return flattenLoop(timer, contexts);
  }
}

function flattenSequence(
  sequence: TimerSequence,
  contexts: FlatTimerContext[],
): FlatTimerPeriod[] {
  return sequence.elements.flatMap((element, index) =>
    flattenTimer(
      element,
      [...contexts, { kind: "sequence", source: sequence, index }],
    )
  );
}

function flattenLoop(
  loop: TimerLoop,
  contexts: FlatTimerContext[],
): FlatTimerPeriod[] {
  const periods: FlatTimerPeriod[] = [];
  for (let i = 0; i < loop.count; i++) {
    periods.push(...flattenTimer(
      loop.element,
      [...contexts, { kind: "loop", source: loop, iteration: i }],
    ));
  }
  return periods;
}
