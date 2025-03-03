import { useCallback, useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

import {
  useAudioContext,
  useAudioContextState,
} from "../lib/audio/context.tsx";
import { formatSeconds } from "../utils/time.ts";
import { PlayerAction, PlayerDisplay, TimerPreset } from "../app/types.ts";
import { actionsAtTime, timeForRelativePeriod } from "../app/actions.ts";
import { duration, flatten } from "../app/flatten.ts";

import classes from "./TimerPlayer.module.css";

export interface TimerPlayerProps {
  preset: TimerPreset;
  autoplay?: boolean;
}

export function TimerPlayer({ preset, autoplay }: TimerPlayerProps) {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(!(autoplay ?? false));

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

  const tick = useCallback(() => {
    setTime((t) => t + 1);
  }, []);

  const flat = useMemo(
    () => flatten(preset.root),
    [preset],
  );

  const presetDuration = useMemo(() => duration(preset.root), [preset]);

  const skipBack = useCallback(() => {
    setTime((t) => timeForRelativePeriod(flat, t, -1));
  }, [flat]);

  const skipForward = useCallback(() => {
    setTime((t) => timeForRelativePeriod(flat, t, +1));
  }, [flat]);

  const { done, actions } = useMemo(
    () => actionsAtTime(flat, time),
    [flat, time],
  );

  useEffect(() => {
    setPaused((prev) => prev || done);
  }, [done]);

  const running = !paused && !done;

  return (
    <div className={classes["timer-player"]}>
      {running && <IntervalManager onTick={tick} />}
      <header>
        <button type="button" disabled={running} onClick={resumePlayer}>
          <Play size={24} />
        </button>
        <button type="button" disabled={!running} onClick={pausePlayer}>
          <Pause size={24} />
        </button>
        <button
          type="button"
          disabled={time === 0}
          onClick={resetPlayer}
        >
          <RotateCcw size={24} />
        </button>
        <button
          type="button"
          onClick={skipBack}
        >
          <SkipBack size={24} />
        </button>
        <button
          type="button"
          onClick={skipForward}
        >
          <SkipForward size={24} />
        </button>
      </header>
      <ActionsRenderer actions={actions} active={!paused} />
      <footer>
        <progress
          value={time}
          max={presetDuration}
        />
      </footer>
    </div>
  );
}

function ActionsRenderer(props: { actions: PlayerAction[]; active: boolean }) {
  const { actions, active } = props;

  // using `active` as an indirect user action signal to trigger sounds
  // otherwise, the browser may block them

  const elements = actions.map((action, index) => {
    switch (action.kind) {
      case "display":
        return (
          <DisplayActionRenderer
            key={index}
            action={action}
          />
        );
      case "speak":
        return active && (
          <SpeakActionRenderer key={action.id} text={action.text} />
        );
      case "beep":
        return active && <BeepActionRenderer key={action.id} />;
      case "finished":
        return <FinishedActionRenderer key={action.kind} />;
    }
  });

  return <>{elements}</>;
}

function SpeakActionRenderer(props: { text: string }) {
  const audioContextState = useAudioContextState();

  useEffect(() => {
    if (audioContextState !== "running") {
      return;
    }
    if (!speechSynthesis.speaking) {
      const utterance = new SpeechSynthesisUtterance(props.text);
      speechSynthesis.speak(utterance);
    }
  }, [audioContextState, props.text]);

  return null;
}

function BeepActionRenderer() {
  const duration = 0.2;

  const audioContext = useAudioContext();
  const audioContextState = useAudioContextState();

  // snapshot the current time at the start of the component
  // this ensures the beep is fixed in time
  const [now] = useState(() => audioContext.currentTime);

  const { gain } = useMemo(() => {
    if (audioContextState !== "running") {
      return {};
    }

    const gain = audioContext.createGain();
    gain.gain.value = 0;
    gain.connect(audioContext.destination);

    const osc = audioContext.createOscillator();
    osc.frequency.value = 440;
    osc.connect(gain);
    osc.start();

    return { gain, osc };
  }, [audioContext, audioContextState]);

  useEffect(() => {
    if (!gain) {
      return;
    }

    gain.gain.setValueAtTime(1, now);
    gain.gain.setValueAtTime(0, now + duration);

    return () => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
    };
  }, [gain]);

  return null;
}

function DisplayActionRenderer(props: { action: PlayerDisplay }) {
  const { round, seconds, text } = props.action;
  return (
    <div className={classes["timer-player-display"]}>
      <div className={classes["round"]}>{round ?? <>&nbsp;</>}</div>
      <div className={classes["time"]}>{formatSeconds(seconds)}</div>
      <div className={classes["text"]}>{text}</div>
    </div>
  );
}

function FinishedActionRenderer() {
  return <div className={classes["timer-finished-display"]}>Finished</div>;
}

function IntervalManager(props: { onTick: () => void }) {
  useEffect(() => {
    const id = setInterval(props.onTick, 1000);

    return () => clearInterval(id);
  }, [props.onTick]);

  return null;
}
