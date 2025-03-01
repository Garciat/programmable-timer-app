import { // @ts-types="react"
  // @ts-types="react"
  useCallback,
  useEffect,
  useState,
} from "react";

import { PlayerAction, TimerPreset } from "../app/types.ts";
import { Interpreter } from "../app/player.ts";

export interface TimerPlayerProps {
  preset: TimerPreset;
}

function InterpreterDriver(props: {
  interpreter: Interpreter;
  onStep: (actions: PlayerAction[]) => void;
}) {
  const { interpreter, onStep } = props;

  useEffect(() => {
    const id = setInterval(() => {
      onStep(interpreter.step());
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [interpreter, onStep]);

  return null;
}

export function TimerPlayer({ preset }: TimerPlayerProps) {
  const [actions, setActions] = useState<PlayerAction[]>([]);
  const [interpreter, setInterpreter] = useState<Interpreter>(() =>
    Interpreter.of(preset.root)
  );
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const snapshot = interpreter.snapshot();
    setActions(interpreter.step());
    return () => {
      snapshot.restore();
    };
  }, [interpreter]);

  const resumePlayer = useCallback(() => {
    setRunning(true);
  }, []);

  const pausePlayer = useCallback(() => {
    setRunning(false);
  }, []);

  const resetPlayer = useCallback(() => {
    setInterpreter(Interpreter.of(preset.root));
  }, [preset]);

  return (
    <>
      {running && !interpreter.isFinished && (
        <InterpreterDriver
          interpreter={interpreter}
          onStep={(actions) => setActions(actions)}
        />
      )}
      <div>
        <button type="button" onClick={() => resumePlayer()}>Resume</button>
        <button type="button" onClick={() => pausePlayer()}>Pause</button>
        <button type="button" onClick={() => resetPlayer()}>Reset</button>
      </div>
      <h2>Preset</h2>
      <pre>{JSON.stringify(preset, null, 2)}</pre>
      <h2>Actions</h2>
      <pre>{JSON.stringify(actions, null, 2)}</pre>
    </>
  );
}
