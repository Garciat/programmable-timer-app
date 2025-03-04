import { useCallback } from "react";
import { useNavigate } from "react-router";

export function useNavigateTransition() {
  const navigate = useNavigate();

  const navigateTransition = useCallback(
    async (href: string, types?: string[]) => {
      if (document.startViewTransition) {
        const tr = document.startViewTransition({
          update: async () => {
            await navigate(href, { flushSync: true });
          },
          types,
        });
        await tr.finished;
      } else {
        await navigate(href);
      }
    },
    [navigate],
  );

  return navigateTransition;
}

declare global {
  interface Document {
    startViewTransition(options: {
      update: () => Promise<void>;
      types?: string[];
    }): ViewTransition;
  }
}
