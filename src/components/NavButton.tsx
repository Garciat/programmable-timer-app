import type { FileQuestion } from "lucide-react";

import { useNavigateTransition } from "../utils/transition.ts";

export interface NavButtonProps {
  icon: typeof FileQuestion;
  href?: string;
  transitions?: string[];
  disabled?: boolean;
  onClick?: () => unknown;
}

export function NavButton(
  { icon, href, transitions, disabled, onClick }: NavButtonProps,
) {
  const navigate = useNavigateTransition();

  const Icon = icon;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={href ? () => navigate(href, transitions) : onClick}
      className="plain"
    >
      <Icon size={24} />
    </button>
  );
}
