import { useEffect } from "react";

export function ReactWakeLock(
  { onChanged }: { onChanged?: (active: boolean) => void },
) {
    if (!("wakeLock" in navigator)) {
      onChanged?.(false);
      return;
    }

    let wakeLock: WakeLockSentinel | null = null;

    function handleLockRelease() {
      if (wakeLock !== null) {
        wakeLock = null;
        onChanged?.(false);
      }
    }

    async function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        try {
          wakeLock = await navigator.wakeLock.request("screen");
          wakeLock.addEventListener("release", handleLockRelease);
          onChanged?.(true);
        } catch (err) {
          console.error("Failed to acquire wake lock:", err);
        }
      }
    }

    if (document.visibilityState === "visible") {
      handleVisibilityChange();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (wakeLock !== null) {
        wakeLock.release();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onChanged]);

  return null;
}
