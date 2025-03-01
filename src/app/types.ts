export interface TimerPreset {
  root: TimerControlElement;
}

export type TimerElement =
  | TimerPeriod
  | TimerControlElement;

export type TimerControlElement =
  | TimerSequence
  | TimerLoop;

export interface TimerPeriod {
  kind: "period";
  name: string;
  seconds: number;
}

export interface TimerSequence {
  kind: "sequence";
  elements: readonly TimerElement[];
}

export interface TimerLoop {
  kind: "loop";
  count: number;
  element: TimerElement;
}

export interface TimerSequenceState {
  kind: "sequence";
  source: TimerSequence;
  index: number;
}

export interface TimerLoopState {
  kind: "loop";
  source: TimerLoop;
  iteration: number;
}

export type FlatTimerContext =
  | TimerSequenceState
  | TimerLoopState;

export interface FlatTimerPeriod {
  contexts: readonly FlatTimerContext[];
  source: TimerPeriod;
}

export type PlayerAction =
  | PlayerSpeak
  | PlayerBeep
  | PlayerDisplay
  | PlayerFinished;

export interface PlayerSpeak {
  kind: "speak";
  text: string;
}

export interface PlayerBeep {
  kind: "beep";
}

export interface PlayerDisplay {
  kind: "display";
  seconds: number;
  text: string;
}

export interface PlayerFinished {
  kind: "finished";
}
