import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";
import { MoveLeft, Volume2, VolumeOff, VolumeX } from "lucide-react";

import { contrastForegroundColor } from "lib/utils/color.ts";
import { switching } from "lib/utils/switch.ts";
import { useAudioContext, useAudioContextState } from "lib/audio/context.tsx";
import { VStack } from "lib/box/VStack.tsx";
import { VFrame } from "lib/box/mod.ts";
import { useAppPreset } from "src/state/context.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { TimerPlayer } from "src/components/TimerPlayer.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";
import { routeHome } from "src/routes.ts";

import stylesAll from "src/pages/all.module.css";

export function PlayPage() {
  const { presetId } = useParams();
  const location = useLocation();
  const [preset] = useAppPreset(presetId ?? "");

  const audioContext = useAudioContext();
  const audioContextState = useAudioContextState();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const initSeconds = useMemo(() => {
    const value = queryParams.get("start");
    return value ? parseInt(value, 10) : 0;
  }, [queryParams]);

  const [color, setColor] = useState<
    { backgroundColor: string; color: string } | null
  >(null);

  function suspendAudio() {
    audioContext.suspend();
  }

  function resumeAudio() {
    audioContext.resume();
  }

  function handleColorChange(color: string | undefined) {
    setColor({
      backgroundColor: color ?? "transparent",
      color: color ? contrastForegroundColor(color) : "inherit",
    });
  }

  const audioButton = switching(audioContextState, {
    running: () => <IconButton icon={Volume2} onClick={suspendAudio} />,
    suspended: () => <IconButton icon={VolumeOff} onClick={resumeAudio} />,
    interrupted: () => <IconButton icon={VolumeOff} onClick={resumeAudio} />,
    closed: () => <IconButton icon={VolumeX} disabled />,
  });

  return (
    <BaseLayout title={preset?.name ?? "Not Found"}>
      <VStack grow={1} alignItems="stretch" style={{ ...color }}>
        <TitleBar
          hideShadow
          left={
            <IconButton
              icon={MoveLeft}
              href={routeHome()}
              transitions={["from-bottom-backwards"]}
            />
          }
          middle={<TitleBarText value={preset?.name ?? "Not Found"} />}
          right={audioButton}
        />
        <VFrame
          alignItems="stretch"
          justify="flex-start"
          className={stylesAll["content-frame"]}
        >
          {preset
            ? (
              <TimerPlayer
                preset={preset}
                initSeconds={initSeconds}
                onColorChange={handleColorChange}
              />
            )
            : (
              <p style={{ textAlign: "center" }}>
                This preset does not exist.
              </p>
            )}
        </VFrame>
      </VStack>
    </BaseLayout>
  );
}
