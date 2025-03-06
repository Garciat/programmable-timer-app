import { useCallback } from "react";

import { ifClass } from "lib/utils/style.ts";
import { useNavigateTransition } from "lib/utils/transition.ts";

export interface LinkButtonProps {
  children: React.ReactNode;
  href: string;
  transitions?: string[];
  disabled?: boolean;
  className?: string;
  onBefore?: () => void | Promise<void>;
}

export function LinkButton(
  { children, href, transitions, disabled, className, onBefore }:
    LinkButtonProps,
) {
  const navigate = useNavigateTransition();

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (disabled) return;
      if (onBefore) await onBefore();
      await navigate(href, transitions);
    },
    [href, transitions, navigate, disabled, onBefore],
  );

  return (
    <a
      href={href}
      role="button"
      onClick={handleClick}
      className={`button ${ifClass(disabled, "disabled")} ${className}`}
    >
      {children}
    </a>
  );
}
