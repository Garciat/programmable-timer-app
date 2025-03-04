import { useCallback, useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

import {
  useAudioContext,
  useAudioContextState,
} from "../lib/audio/context.tsx";
import { HStack } from "../lib/box/HStack.tsx";
import { VStack } from "../lib/box/VStack.tsx";
import { formatSeconds } from "../utils/time.ts";
import { PlayerAction, PlayerDisplay, TimerPreset } from "../app/types.ts";
import { actionsAtTime, timeForRelativePeriod } from "../app/actions.ts";
import { duration, flatten } from "../app/flatten.ts";

import classes from "./TimerPlayer.module.css";
import { IconButton } from "./IconButton.tsx";

export interface TimerPlayerProps {
  preset: TimerPreset;
}

export function TimerPlayer({ preset }: TimerPlayerProps) {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);

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
    <VStack grow={1} className={classes["timer-player"]}>
      {running && <IntervalManager onTick={tick} />}
      <HStack kind="header" gap="1rem">
        <IconButton icon={Play} disabled={running} onClick={resumePlayer} />
        <IconButton icon={Pause} disabled={!running} onClick={pausePlayer} />
        <IconButton icon={RotateCcw} onClick={resetPlayer} />
        <IconButton icon={SkipBack} onClick={skipBack} />
        <IconButton icon={SkipForward} onClick={skipForward} />
      </HStack>
      <ActionsRenderer actions={actions} active={!paused} />
      <VStack kind="footer">
        <progress
          value={time}
          max={presetDuration}
        />
      </VStack>
    </VStack>
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
  }, [gain, now]);

  return null;
}

function DisplayActionRenderer(props: { action: PlayerDisplay }) {
  const { round, seconds, text } = props.action;
  return (
    <VStack grow={1} className={classes["timer-player-display"]}>
      <VStack kind="header" grow={1} justify="flex-end">
        {round ?? <>&nbsp;</>}
      </VStack>
      <VStack kind="article">
        <span>{formatSeconds(seconds)}</span>
      </VStack>
      <VStack kind="footer" grow={1} justify="flex-end">
        {text}
      </VStack>
    </VStack>
  );
}

function FinishedActionRenderer() {
  return (
    <VStack grow={1} className={classes["timer-finished-display"]}>
      Finished
    </VStack>
  );
}

function IntervalManager(props: { onTick: () => void }) {
  useEffect(() => {
    const id = setInterval(props.onTick, 1000);

    return () => clearInterval(id);
  }, [props.onTick]);

  return null;
}
