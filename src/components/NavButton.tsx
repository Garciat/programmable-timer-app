import { DynamicIcon, type IconName } from "lucide-react/dynamic";

export interface NavButtonProps {
  icon: IconName;
  onClick: () => unknown;
}

export function NavButton({ icon, onClick }: NavButtonProps) {
  return (
    <button type="button" onClick={onClick} className="plain">
      <DynamicIcon name={icon} size={28} />
    </button>
  );
}
