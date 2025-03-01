import { useCallback, useEffect, useMemo, useState } from "react";

import { TimerPreset } from "../app/types.ts";
import { actionsAtTime } from "../app/actions.ts";
import { flatten } from "../app/flatten.ts";

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
  }, []);

  const flat = useMemo(
    () => flatten(preset.root),
    [preset],
  );

  const { done, actions } = useMemo(
    () => actionsAtTime(flat, time),
    [flat, time],
  );

  const running = !paused && !done;

  return (
    <>
      {running && <IntervalManager onTick={() => setTime((t) => t + 1)} />}
      <div>
        <button type="button" onClick={() => resumePlayer()}>Resume</button>
        <button type="button" onClick={() => pausePlayer()}>Pause</button>
        <button type="button" onClick={() => resetPlayer()}>Reset</button>
      </div>
      <div>
        {running ? "Running" : paused ? "Paused" : "Done"}
      </div>
      <h2>Preset</h2>
      <pre>{JSON.stringify(preset, null, 2)}</pre>
      <h2>Actions</h2>
      <pre>{JSON.stringify(actions, null, 2)}</pre>
    </>
  );
}

function IntervalManager(props: { onTick: () => void }) {
  useEffect(() => {
    const id = setInterval(props.onTick, 1000);

    return () => clearInterval(id);
  }, [props.onTick]);

  return null;
}
