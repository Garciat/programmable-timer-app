import { useCallback, useEffect, useMemo, useState } from "react";
import { MonitorCheck, MonitorDown, MonitorX } from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { switching } from "lib/utils/switch.ts";
import { useInstallPrompt } from "src/transient/install.tsx";

export function InstallSubsection() {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const installPromptEvent = useInstallPrompt();

  useEffect(() => {
    setIsInstalled(
      globalThis.matchMedia("(display-mode: standalone)").matches ||
        (globalThis.navigator.standalone ?? false),
    );

    // Can't get this to work yet

    // if (globalThis.navigator.getInstalledRelatedApps) {
    //   globalThis.navigator.getInstalledRelatedApps().then((apps) => {
    //     setIsInstalled(apps.length > 0);
    //   });
    // }
  }, []);

  const handleInstallRequest = useCallback(async () => {
    if (installPromptEvent) {
      const result = await installPromptEvent.prompt();
      if (result.outcome === "accepted") {
        setIsInstalled(true);
      }
    }
  }, [installPromptEvent]);

  const installationState = useMemo(() => {
    if (isInstalled) {
      return "installed";
    } else if (installPromptEvent) {
      return "canInstall";
    } else {
      return "unavailable";
    }
  }, [isInstalled, installPromptEvent]);

  const installButton = switching(installationState, {
    installed: () => (
      <button type="button">
        <MonitorCheck />
        <span>Installed!</span>
      </button>
    ),
    canInstall: () => (
      <button
        type="button"
        onClick={handleInstallRequest}
      >
        <MonitorDown />
        <span>Install</span>
      </button>
    ),
    unavailable: () => (
      <button type="button">
        <MonitorX />
        <span>Cannot prompt app installation</span>
      </button>
    ),
  });

  return (
    <>
      <VStack kind="article">
        <HStack kind="header">
          <h3>Install App</h3>
        </HStack>
        <HStack justify="flex-start">
          {installButton}
        </HStack>
      </VStack>
    </>
  );
}
