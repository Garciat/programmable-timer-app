import { useCallback } from "react";
import { Hourglass, Play, Settings, Share } from "lucide-react";

import { useAudioContext } from "lib/audio/context.tsx";
import { HStack, VStack } from "lib/box/mod.ts";
import { formatSeconds } from "lib/utils/time.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";
import { duration } from "src/app/flatten.ts";
import { generateShareURL } from "src/app/share.ts";
import { TimerPreset } from "src/app/types.ts";
import { createHistoryRecord } from "src/app/history/preset.ts";
import { useAppPresetDelete } from "src/state/context.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { IconMenu } from "src/components/IconMenu.tsx";
import { PresetDisplay } from "src/components/PresetDisplay.tsx";

export interface PresetListProps {
  presets: TimerPreset[];
}

export function PresetList({ presets }: PresetListProps) {
  const navigate = useNavigateTransition();
  const doDelete = useAppPresetDelete();

  const audioContext = useAudioContext();

  function deletePreset(preset: TimerPreset) {
    if (globalThis.confirm(`Delete preset "${preset.name}"?`)) {
      doDelete(preset.id);
    }
  }

  async function beforePlay() {
    // "Unlock" the speech synthesis API by speaking an empty utterance.
    globalThis.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    // We just got a user interaction, so we can resume the audio context.
    await audioContext.resume();
  }

  async function sharePreset(preset: TimerPreset) {
    const url = await generateShareURL(preset);

    try {
      await navigator.clipboard.writeText(url);
      globalThis.alert("Copied share link to clipboard.");
      return;
    } catch (error) {
      console.error("Error copying share link to clipboard:", error);
    }

    const shareData = {
      title: `Timer Preset: ${preset.name}`,
      text: `Check out my timer preset: ${preset.name}`,
      url: url,
    };

    if (navigator.canShare(shareData)) {
      try {
        return await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  }

  const handleCreateHistoryRecord = useCallback(async (preset: TimerPreset) => {
    const recordId = await createHistoryRecord(preset);
    await navigate(`/history/record/${recordId}/edit`, ["from-right"]);
  }, []);

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
            <h2>{preset.name}</h2>
            <HStack gap="0.5rem">
              <HStack>
                <Hourglass size={16} />
                <span>{formatSeconds(duration(preset.root))}</span>
              </HStack>
            </HStack>
          </HStack>
          <PresetDisplay preset={preset} />
          <HStack kind="footer" justify="space-between">
            <HStack justify="flex-start" gap="0.5rem">
              <IconMenu icon={Settings} title="Preset options">
                {{
                  label: "Edit",
                  onSelect: () =>
                    navigate(`/edit/${preset.id}`, ["from-right"]),
                }}
                {{
                  label: "Add history record",
                  onSelect: () => handleCreateHistoryRecord(preset),
                }}
                {{
                  label: "Share via QR",
                  onSelect: () => navigate(`/qr/${preset.id}`, ["from-right"]),
                }}
                {{ label: "Delete", onSelect: () => deletePreset(preset) }}
              </IconMenu>
              <IconButton
                icon={Share}
                onClick={() => sharePreset(preset)}
              />
            </HStack>
            <HStack justify="flex-end" gap="0.5rem">
              <IconButton
                icon={Play}
                href={`/play/${preset.id}`}
                transitions={["from-bottom"]}
                onClick={beforePlay}
              />
            </HStack>
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}
