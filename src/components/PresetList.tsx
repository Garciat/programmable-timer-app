import { Pencil, Play, Share, Trash2 } from "lucide-react";

import { useAudioContext } from "../lib/audio/context.tsx";
import { HStack } from "../lib/box/HStack.tsx";
import { VStack } from "../lib/box/VStack.tsx";
import { formatSeconds } from "../utils/time.ts";
import { useNavigateTransition } from "../utils/transition.ts";
import { duration } from "../app/flatten.ts";
import { encodeShare } from "../app/share.ts";
import { TimerPreset } from "../app/types.ts";
import { useAppPresetDelete } from "../state/context.tsx";
import { PresetDisplay } from "./PresetDisplay.tsx";

export interface PresetListProps {
  presets: TimerPreset[];
}

export function PresetList({ presets }: PresetListProps) {
  const navigate = useNavigateTransition();
  const doDelete = useAppPresetDelete();

  const audioContext = useAudioContext();

  function editPreset(preset: TimerPreset) {
    navigate(`/edit/${preset.id}`);
  }

  function deletePreset(preset: TimerPreset) {
    if (globalThis.confirm(`Delete preset "${preset.name}"?`)) {
      doDelete(preset.id);
    }
  }

  async function playPreset(preset: TimerPreset) {
    // We just got a user interaction, so we can resume the audio context.
    await audioContext.resume();
    navigate(`/play/${preset.id}`, ["from-bottom"]);
  }

  async function sharePreset(preset: TimerPreset) {
    const content = await encodeShare(preset);

    const url = new URL(globalThis.location.href);
    url.pathname = `/share/${encodeURIComponent(content)}`;

    try {
      await navigator.clipboard.writeText(url.toString());
      globalThis.alert("Copied share link to clipboard.");
      return;
    } catch (error) {
      console.error("Error copying share link to clipboard:", error);
    }

    const shareData = {
      title: `Timer Preset: ${preset.name}`,
      text: `Check out my timer preset: ${preset.name}`,
      url: url.toString(),
    };

    if (navigator.canShare(shareData)) {
      try {
        return await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  }

  const buttonSize = 24;

  return (
    <VStack gap="2rem">
      {presets.map((preset) => (
        <VStack key={preset.id} kind="article" gap="0.5rem">
          <HStack kind="header" alignItems="center" justify="space-between">
            <h2>
              {preset.name}
            </h2>
            <span>
              {formatSeconds(duration(preset.root))}
            </span>
          </HStack>
          <PresetDisplay preset={preset} />
          <HStack kind="footer" justify="space-between">
            <HStack alignItems="center" justify="flex-start" gap="0.5rem">
              <button
                type="button"
                onClick={() =>
                  editPreset(preset)}
              >
                <Pencil size={buttonSize} />
              </button>
              <button
                type="button"
                onClick={() =>
                  sharePreset(preset)}
              >
                <Share size={buttonSize} />
              </button>
              <button
                type="button"
                onClick={() =>
                  deletePreset(preset)}
              >
                <Trash2 size={buttonSize} />
              </button>
            </HStack>
            <HStack alignItems="center" justify="flex-end" gap="0.5rem">
              <button type="button" onClick={() => playPreset(preset)}>
                <Play size={buttonSize} />
              </button>
            </HStack>
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}
