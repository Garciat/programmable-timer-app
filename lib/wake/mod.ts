import { useEffect } from "react";

export function ReactWakeLock(
  props: { onChanged?: (active: boolean) => void },
) {
  if (!("wakeLock" in navigator)) {
    return;
  }

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    function handleLockRelease() {
      if (wakeLock !== null) {
        wakeLock = null;
        props.onChanged?.(false);
      }
    }

    async function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        try {
          wakeLock = await navigator.wakeLock.request("screen");
          wakeLock.addEventListener("release", handleLockRelease);
          props.onChanged?.(true);
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
  }, []);

  return null;
}
