import { useCallback } from "react";
import type { FileQuestion } from "lucide-react";

import { useNavigateTransition } from "lib/utils/transition.ts";

import styles from "src/components/IconButton.module.css";

export interface IconButtonProps {
  icon: typeof FileQuestion;
  href?: string;
  transitions?: string[];
  disabled?: boolean;
  className?: string;
  onClick?: () => unknown | Promise<unknown>;
}

export function IconButton(
  { icon, href, transitions, disabled, className, onClick }: IconButtonProps,
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
      className={`${styles["icon-button"]} ${className}`}
    >
      <Icon className={styles["icon"]} />
    </button>
  );
}
