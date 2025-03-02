import { useCallback, useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { useAudioContext } from "../lib/audio/ReactAudioContext.ts";
import { formatSeconds } from "../utils/time.ts";
import { PlayerAction, PlayerDisplay, TimerPreset } from "../app/types.ts";
import { actionsAtTime } from "../app/actions.ts";
import { flatten } from "../app/flatten.ts";

import "./TimerPlayer.css";

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
      <ActionsRenderer actions={actions} active={!paused} />
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
  const duration = 0.2;

  const audioContext = useAudioContext();

  const { gain } = useMemo(() => {
    const gain = audioContext.createGain();
    gain.gain.value = 0;
    gain.connect(audioContext.destination);

    const osc = audioContext.createOscillator();
    osc.frequency.value = 440;
    osc.connect(gain);
    osc.start();

    return { gain, osc };
  }, [audioContext]);

  useEffect(() => {
    const now = audioContext.currentTime;
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
    <div className="timer-player-display">
      <div className="round">{round ?? <>&nbsp;</>}</div>
      <div className="time">{formatSeconds(seconds)}</div>
      <div className="text">{text}</div>
    </div>
  );
}

function FinishedActionRenderer() {
  return <div className="timer-finished-display">Finished</div>;
}

function IntervalManager(props: { onTick: () => void }) {
  useEffect(() => {
    const id = setInterval(props.onTick, 1000);

    return () => clearInterval(id);
  }, [props.onTick]);

  return null;
}
