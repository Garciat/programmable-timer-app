import { useEffect } from "react";
import { useTransientState } from "src/transient/context.tsx";

export interface AppInstallPromptListenerProps {
  preventDefault?: boolean;
}

export function AppInstallPromptListener(
  { preventDefault }: AppInstallPromptListenerProps,
) {
  const [, setState] = useTransientState();

  useEffect(() => {
    function handler(event: BeforeInstallPromptEvent) {
      if (preventDefault) {
        event.preventDefault();
      }

      setState((state) => ({
        ...state,
        installPrompt: event,
      }));
    }

    globalThis.addEventListener("beforeinstallprompt", handler);

    return () => {
      globalThis.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  return null;
}

export function useInstallPrompt() {
  const [state] = useTransientState();
  return state.installPrompt;
}

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<{ outcome: string }>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface Navigator {
    getInstalledRelatedApps(): Promise<RelatedApplication[]>;
    standalone?: boolean;
  }

  interface RelatedApplication {
    platform: string;
    url: string;
  }
}
