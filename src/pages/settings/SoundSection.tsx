import { useCallback, useMemo } from "react";
import { BellRing } from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { useAudioContext } from "lib/audio/context.tsx";
import { UserSoundSettings } from "src/state/types.ts";

interface SoundSectionProps {
  settings: UserSoundSettings;
  onChange: (settings: UserSoundSettings) => void;
}

export function SoundSection(
  { settings, onChange }: SoundSectionProps,
) {
  const audioContext = useAudioContext();

  // relative to A4
  const note = Math.round(
    12 * Math.log2(settings.beepFrequency / 440),
  );

  // note name with octave number, note=0 is A4, note=-12 is A3, etc.
  const noteName = useMemo(() => {
    const notes = [
      "A",
      "A♯",
      "B",
      "C",
      "C♯",
      "D",
      "D♯",
      "E",
      "F",
      "F♯",
      "G",
      "G♯",
    ];
    const octave = Math.floor(note / 12) + 4;
    const noteName = notes[(120 + note) % 12];
    return `${noteName}${octave}`;
  }, [note]);

  const handleNoteChange = useCallback((note: number) => {
    const frequency = 440 * Math.pow(2, note / 12);
    onChange({
      ...settings,
      beepFrequency: frequency,
    });
  }, [settings, onChange]);

  const handleDurationChange = useCallback((duration: number) => {
    onChange({
      ...settings,
      beepDuration: duration,
    });
  }, [settings, onChange]);

  const playBeep = useCallback(() => {
    if (!audioContext) {
      return;
    }

    audioContext.resume();

    const gain = audioContext.createGain();
    gain.gain.value = 0;
    gain.connect(audioContext.destination);

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = settings.beepFrequency;
    oscillator.type = settings.beepWaveform;
    oscillator.connect(gain);
    oscillator.start();

    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(1, now);
    gain.gain.setValueAtTime(0, now + settings.beepDuration);
  }, [
    audioContext,
    settings.beepFrequency,
    settings.beepDuration,
    settings.beepWaveform,
  ]);

  const WaveformOption = (
    props: {
      name: string;
      value: typeof settings.beepWaveform;
    },
  ) => (
    <label>
      <span>{props.name}</span>
      <input
        type="radio"
        name="beepWaveform"
        checked={settings.beepWaveform === props.value}
        onChange={() => onChange({ ...settings, beepWaveform: props.value })}
      />
    </label>
  );

  return (
    <VStack kind="section">
      <HStack kind="header">
        <BellRing />
        <h2>Sound</h2>
      </HStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Beep Frequency</h3>
        </HStack>
        <HStack gap="1rem">
          <span style={{ minWidth: "4ch" }}>{noteName}</span>
          <input
            type="range"
            value={note}
            min={-24}
            max={+24}
            step={1}
            onChange={(e) => handleNoteChange(e.target.valueAsNumber)}
            style={{ flexGrow: 1 }}
          />
          <button
            type="button"
            onClick={playBeep}
          >
            Play
          </button>
        </HStack>
      </VStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Beep Duration</h3>
        </HStack>
        <HStack gap="1rem">
          <span style={{ minWidth: "4ch" }}>{settings.beepDuration}s</span>
          <input
            type="range"
            value={settings.beepDuration}
            min={0.1}
            max={0.9}
            step={0.1}
            onChange={(e) => handleDurationChange(e.target.valueAsNumber)}
            style={{ flexGrow: 1 }}
          />
        </HStack>
      </VStack>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Beep Waveform</h3>
        </HStack>
        <HStack gap="0.5rem" justify="flex-start" wrap="wrap">
          <WaveformOption name="Sine" value="sine" />
          <WaveformOption name="Square" value="square" />
          <WaveformOption name="Sawtooth" value="sawtooth" />
          <WaveformOption name="Triangle" value="triangle" />
        </HStack>
      </VStack>
    </VStack>
  );
}
