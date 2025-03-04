import { Pencil, Play, Share, Trash2 } from "lucide-react";

import { useAudioContext } from "lib/audio/context.tsx";
import { HStack, VStack } from "lib/box/mod.ts";
import { formatSeconds } from "src/utils/time.ts";
import { duration } from "src/app/flatten.ts";
import { encodeShare } from "src/app/share.ts";
import { TimerPreset } from "src/app/types.ts";
import { useAppPresetDelete } from "src/state/context.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { PresetDisplay } from "src/components/PresetDisplay.tsx";

export interface PresetListProps {
  presets: TimerPreset[];
}

export function PresetList({ presets }: PresetListProps) {
  const doDelete = useAppPresetDelete();

  const audioContext = useAudioContext();

  function deletePreset(preset: TimerPreset) {
    if (globalThis.confirm(`Delete preset "${preset.name}"?`)) {
      doDelete(preset.id);
    }
  }

  async function resumeAudioContext() {
    // We just got a user interaction, so we can resume the audio context.
    await audioContext.resume();
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

  return (
    <VStack alignItems="stretch" gap="2rem">
      {presets.map((preset) => (
        <VStack
          key={preset.id}
          kind="article"
          alignItems="stretch"
          gap="0.5rem"
        >
          <HStack kind="header" justify="space-between">
            <h2>
              {preset.name}
            </h2>
            <span>
              {formatSeconds(duration(preset.root))}
            </span>
          </HStack>
          <PresetDisplay preset={preset} />
          <HStack kind="footer" justify="space-between">
            <HStack justify="flex-start" gap="0.5rem">
              <IconButton icon={Pencil} href={`/edit/${preset.id}`} />
              <IconButton
                icon={Share}
                onClick={() => sharePreset(preset)}
              />
              <IconButton
                icon={Trash2}
                onClick={() => deletePreset(preset)}
              />
            </HStack>
            <HStack justify="flex-end" gap="0.5rem">
              <IconButton
                icon={Play}
                href={`/play/${preset.id}`}
                transitions={["from-bottom"]}
                onClick={resumeAudioContext}
              />
            </HStack>
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}
