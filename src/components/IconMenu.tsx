import { useCallback, useMemo } from "react";
import type { FileQuestion } from "lucide-react";

import styles from "src/components/IconMenu.module.css";

export interface IconMenuOptionProps {
  label: string;
  onSelect: () => void;
}

export interface IconMenuProps {
  icon: typeof FileQuestion;
  title: string;
  children: IconMenuOptionProps | IconMenuOptionProps[];
}

export function IconMenu(
  { icon: Icon, title, children }: IconMenuProps,
) {
  const items = useMemo(() => Array.isArray(children) ? children : [children], [
    children,
  ]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const index = parseInt(event.target.value, 10);
      items[index].onSelect();
    },
    [children],
  );

  return (
    <label className={styles["icon-menu"]}>
      <Icon />
      <select value="" onChange={handleChange}>
        <option disabled value="">{title}</option>
        {items.map((item, index) => (
          <option key={index} value={index}>{item.label}</option>
        ))}
      </select>
    </label>
  );
}
