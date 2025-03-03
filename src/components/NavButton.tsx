import type { FileQuestion } from "lucide-react";

export interface NavButtonProps {
  icon: typeof FileQuestion;
  disabled?: boolean;
  onClick?: () => unknown;
}

export function NavButton(
  { icon, disabled, onClick }: NavButtonProps,
) {
  const Icon = icon;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="plain"
    >
      <Icon size={24} />
    </button>
  );
}
