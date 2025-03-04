import { useCallback } from "react";
import type { FileQuestion } from "lucide-react";

import { useNavigateTransition } from "../utils/transition.ts";

export interface NavButtonProps {
  icon: typeof FileQuestion;
  href?: string;
  transitions?: string[];
  disabled?: boolean;
  onClick?: () => unknown | Promise<unknown>;
}

export function NavButton(
  { icon, href, transitions, disabled, onClick }: NavButtonProps,
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
      className="plain"
    >
      <Icon size={24} />
    </button>
  );
}
