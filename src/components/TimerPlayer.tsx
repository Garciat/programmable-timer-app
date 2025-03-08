import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BookCheck,
  Lightbulb,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { useAudioContext, useAudioContextState } from "lib/audio/context.tsx";
import { HStack, VStack } from "lib/box/mod.ts";
import { formatSeconds, sleep } from "lib/utils/time.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";
import { ReactWakeLock } from "lib/wake/mod.ts";
import { createHistoryRecord } from "src/app/history/preset.ts";
import { PlayerAction, PlayerDisplay, TimerPreset } from "src/app/types.ts";
import { actionsAtTime, timeForRelativePeriod } from "src/app/actions.ts";
import { duration, flatten } from "src/app/flatten.ts";
import { useAppSettingsVoice, useAppSoundSettings } from "src/state/utils.ts";
import { IconButton } from "src/components/IconButton.tsx";
import { routeHistoryRecordEdit } from "src/routes.ts";

import classes from "src/components/TimerPlayer.module.css";

const CurrentPresetContext = createContext<TimerPreset | null>(null);

function useCurrentPreset() {
  const context = useContext(CurrentPresetContext);
  if (!context) {
    throw new Error("useCurrentPreset must be used within a TimerPlayer");
  }
  return context;
}

export interface TimerPlayerProps {
  preset: TimerPreset;
  onColorChange: (color: string) => void;
}

export function TimerPlayer({ preset, onColorChange }: TimerPlayerProps) {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hasWakeLock, setHasWakeLock] = useState(false);

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
    <CurrentPresetContext.Provider value={preset}>
      <VStack grow={1} alignItems="stretch" className={classes["timer-player"]}>
        {running && <IntervalManager onTick={tick} />}
        {running && <ReactWakeLock onChanged={setHasWakeLock} />}
        <HStack kind="header" gap="1rem">
          {running
            ? <IconButton icon={Pause} onClick={pausePlayer} />
            : <IconButton icon={Play} onClick={resumePlayer} />}
          <IconButton icon={RotateCcw} onClick={resetPlayer} />
          <IconButton icon={SkipBack} onClick={skipBack} />
          <IconButton icon={SkipForward} onClick={skipForward} />
          <IconButton
            icon={Lightbulb}
            disabled={!hasWakeLock}
            onClick={() =>
              alert(
                "This lightbulb means your screen will stay on while the preset is playing.",
              )}
          />
        </HStack>
        <ActionsRenderer
          actions={actions}
          active={!paused}
          onColorChange={onColorChange}
        />
        <VStack kind="footer">
          <progress
            value={time}
            max={presetDuration}
          />
        </VStack>
      </VStack>
    </CurrentPresetContext.Provider>
  );
}

function ActionsRenderer(
  props: {
    actions: PlayerAction[];
    active: boolean;
    onColorChange: (color: string) => void;
  },
) {
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
            onColorChange={props.onColorChange}
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
  const voice = useAppSettingsVoice();

  useEffect(() => {
    if (audioContextState !== "running") {
      return;
    }

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = props.text;
    utterance.voice = voice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

    return () => {
      speechSynthesis.cancel();
    };
  }, [audioContextState, voice, props.text]);

  return null;
}

function BeepActionRenderer() {
  const soundSettings = useAppSoundSettings();

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
    osc.frequency.value = soundSettings.beepFrequency;
    osc.type = soundSettings.beepWaveform;
    osc.connect(gain);
    osc.start();

    return { gain, osc };
  }, [
    soundSettings.beepFrequency,
    soundSettings.beepWaveform,
    audioContext,
    audioContextState,
  ]);

  useEffect(() => {
    if (!gain) {
      return;
    }

    gain.gain.setValueAtTime(1, now);
    gain.gain.setValueAtTime(0, now + soundSettings.beepDuration);

    return () => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
    };
  }, [soundSettings.beepDuration, gain, now]);

  return null;
}

function DisplayActionRenderer(
  props: {
    action: PlayerDisplay;
    onColorChange: (color: string) => void;
  },
) {
  const { round, seconds, text } = props.action;

  useEffect(() => {
    if (props.action.backgroundColor === undefined) {
      return;
    }
    props.onColorChange(props.action.backgroundColor);
  }, [props.action.backgroundColor]);

  return (
    <VStack
      grow={1}
      alignItems="stretch"
      className={classes["timer-player-display"]}
    >
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
  const navigate = useNavigateTransition();
  const preset = useCurrentPreset();
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(async () => {
    const recordId = await createHistoryRecord(preset);
    setSaved(true);
    await sleep(200);
    await navigate(routeHistoryRecordEdit(recordId), ["from-right"]);
  }, [preset.id, preset.name, preset.root]);

  return (
    <VStack grow={1} gap="2rem" className={classes["timer-finished-display"]}>
      <header>
        <h1>Finished</h1>
      </header>
      {saved
        ? (
          <button type="button">
            <BookCheck />
            <span>Saved!</span>
          </button>
        )
        : (
          <button type="button" onClick={handleSave}>
            <NotebookPen />
            <span>Save</span>
          </button>
        )}
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
