import { useCallback } from "react";
import type { FileQuestion } from "lucide-react";

import { useNavigateTransition } from "src/utils/transition.ts";

export interface IconButtonProps {
  icon: typeof FileQuestion;
  size?: number;
  href?: string;
  transitions?: string[];
  disabled?: boolean;
  onClick?: () => unknown | Promise<unknown>;
}

export function IconButton(
  { icon, size, href, transitions, disabled, onClick }: IconButtonProps,
) {
  const navigate = useNavigateTransition();

  const Icon = icon;

  const handleClick = useCallback(async () => {
    await onClick?.();
    if (href) {
      await navigate(href, transitions);
    }
  }, [href, transitions, navigate, onClick]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
    >
      <Icon size={size ?? 24} />
    </button>
  );
}
