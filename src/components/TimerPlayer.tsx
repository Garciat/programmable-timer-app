import {
  useCallback,
  useEffect,
  useMemo, // @ts-types="react"
  useRef,
  useState,
} from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { PlayerAction, PlayerDisplay, TimerPreset } from "../app/types.ts";
import { actionsAtTime } from "../app/actions.ts";
import { flatten } from "../app/flatten.ts";

import "./TimerPlayer.css";
import { formatSeconds } from "../utils/time.ts";

export interface TimerPlayerProps {
  preset: TimerPreset;
}

export function TimerPlayer({ preset }: TimerPlayerProps) {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(true);

  const resumePlayer = useCallback(() => {
    setPaused(false);
  }, []);

  const pausePlayer = useCallback(() => {
    setPaused(true);
  }, []);

  const resetPlayer = useCallback(() => {
    setTime(0);
    setPaused(true);
  }, []);

  const flat = useMemo(
    () => flatten(preset.root),
    [preset],
  );

  const { done, actions } = useMemo(
    () => actionsAtTime(flat, time),
    [flat, time],
  );

  useEffect(() => {
    setPaused((prev) => prev || done);
  }, [done]);

  const running = !paused && !done;

  return (
    <div className="timer-player">
      {running && <IntervalManager onTick={() => setTime((t) => t + 1)} />}
      <header>
        <button type="button" disabled={running} onClick={() => resumePlayer()}>
          <Play size={24} />
        </button>
        <button type="button" disabled={!running} onClick={() => pausePlayer()}>
          <Pause size={24} />
        </button>
        <button
          type="button"
          disabled={time === 0}
          onClick={() => resetPlayer()}
        >
          <RotateCcw size={24} />
        </button>
      </header>
      {(!paused || time > 0) && <ActionsRenderer actions={actions} />}
    </div>
  );
}

function ActionsRenderer(props: { actions: PlayerAction[] }) {
  const { actions } = props;

  const elements = actions.map((action) => {
    switch (action.kind) {
      case "speak":
        return <SpeakActionRenderer key={action.id} text={action.text} />;
      case "beep":
        return <BeepActionRenderer key={action.id} />;
      case "display":
        return (
          <DisplayActionRenderer
            key={action.seconds}
            action={action}
          />
        );
      case "finished":
        return <FinishedActionRenderer key={action.kind} />;
    }
  });

  return <>{elements}</>;
}

function SpeakActionRenderer(props: { text: string }) {
  const utterance = new SpeechSynthesisUtterance();

  useEffect(() => {
    if (!speechSynthesis.speaking) {
      utterance.text = props.text;
      speechSynthesis.speak(utterance);
    }
  }, [props.text]);

  return null;
}

function BeepActionRenderer() {
  const context = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!context.current) {
      context.current = new AudioContext();
      const oscillator = context.current.createOscillator();
      oscillator.frequency.value = 440;
      oscillator.connect(context.current.destination);
      oscillator.start();
    }
    setTimeout(() => {
      context.current?.close();
      context.current = null;
    }, 200);
    return () => {
      context.current?.close();
      context.current = null;
    };
  }, []);

  return null;
}

function DisplayActionRenderer(props: { action: PlayerDisplay }) {
  const { round, seconds, text } = props.action;
  return (
    <div className="timer-player-display">
      <div className="round">{round}</div>
      <div className="time">{formatSeconds(seconds)}</div>
      <div className="text">{text}</div>
    </div>
  );
}

function FinishedActionRenderer() {
  return <div>Finished</div>;
}

function IntervalManager(props: { onTick: () => void }) {
  useEffect(() => {
    const id = setInterval(props.onTick, 1000);

    return () => clearInterval(id);
  }, [props.onTick]);

  return null;
}
