import type { FileQuestion } from "lucide-react";

export interface NavButtonProps {
  icon: typeof FileQuestion;
  onClick: () => unknown;
}

export function NavButton({ icon, onClick }: NavButtonProps) {
  const Icon = icon;
  return (
    <button type="button" onClick={onClick} className="plain">
      <Icon size={24} />
    </button>
  );
}
