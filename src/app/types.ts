export interface TimerPreset {
  root: TimerElement;
}

export type TimerElement =
  | TimerPeriod
  | TimerSequence
  | TimerLoop;

export interface TimerPeriod {
  kind: "period";
  name: string;
  seconds: number;
}

export interface TimerSequence {
  kind: "sequence";
  elements: TimerElement[];
}

export interface TimerLoop {
  kind: "loop";
  count: number;
  element: TimerElement;
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
