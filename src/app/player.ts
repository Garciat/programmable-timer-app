import {
  PlayerAction,
  TimerElement,
  TimerLoop,
  TimerPeriod,
  TimerSequence,
} from "./types.ts";

type TimerState =
  | PeriodState
  | SequenceState
  | LoopState;

interface PeriodState {
  kind: "period";
  timer: TimerPeriod;
  time: number;
}

interface SequenceState {
  kind: "sequence";
  timer: TimerSequence;
  index: number;
}

interface LoopState {
  kind: "loop";
  timer: TimerLoop;
  iteration: number;
}

function makeTimerState(element: TimerElement): TimerState {
  switch (element.kind) {
    case "period":
      return { kind: "period", timer: element, time: 0 };
    case "sequence":
      return { kind: "sequence", timer: element, index: 0 };
    case "loop":
      return { kind: "loop", timer: element, iteration: 0 };
  }
}

type StepResult =
  | { kind: "actions"; actions: PlayerAction[] }
  | { kind: "push"; timer: TimerElement }
  | { kind: "pop" };

export class Interpreter {
  #stack: TimerState[];

  private constructor(stack: TimerState[]) {
    this.#stack = stack;
  }

  static of(timer: TimerElement): Interpreter {
    return new Interpreter([makeTimerState(timer)]);
  }

  step(): PlayerAction[] {
    while (this.#stack.length > 0) {
      const current = this.#stack[this.#stack.length - 1];

      const result = this.stepState(current);

      switch (result.kind) {
        case "actions":
          return result.actions;
        case "push":
          this.#stack.push(makeTimerState(result.timer));
          break;
        case "pop":
          this.#stack.pop();
          break;
      }
    }

    return [{ kind: "finished" }];
  }

  get isFinished(): boolean {
    return this.#stack.length === 0;
  }

  snapshot(): { restore: () => void } {
    const stack = this.#stack.map((state) => ({ ...state }));
    return {
      restore: () => {
        this.#stack = stack;
      },
    };
  }

  private stepState(state: TimerState): StepResult {
    switch (state.kind) {
      case "period":
        return this.stepPeriod(state);
      case "sequence":
        return this.stepSequence(state);
      case "loop":
        return this.stepLoop(state);
    }
  }

  private stepPeriod(state: PeriodState): StepResult {
    if (state.time === state.timer.seconds) {
      return { kind: "pop" };
    }

    const timeLeft = state.timer.seconds - state.time;

    const actions: PlayerAction[] = [
      { kind: "display", seconds: timeLeft, text: state.timer.name } as const,
    ];

    if (state.time === 0) {
      actions.push({ kind: "speak", text: state.timer.name } as const);
    } else if (timeLeft <= 3) {
      actions.push({ kind: "beep" } as const);
    }

    state.time += 1;

    return { kind: "actions", actions };
  }

  private stepSequence(state: SequenceState): StepResult {
    if (state.index === state.timer.elements.length) {
      return { kind: "pop" };
    }

    const element = state.timer.elements[state.index];

    state.index += 1;

    return { kind: "push", timer: element };
  }

  private stepLoop(state: LoopState): StepResult {
    if (state.iteration === state.timer.count) {
      return { kind: "pop" };
    }

    state.iteration += 1;

    return { kind: "push", timer: state.timer.element };
  }
}
