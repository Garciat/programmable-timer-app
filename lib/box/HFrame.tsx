import { HStack, HStackProps } from "lib/box/HStack.tsx";

import styles from "lib/box/all.module.css";

export type HFrameProps = HStackProps;

export function HFrame(props: HFrameProps) {
  const { children, className, ...rest } = props;

  return (
    <HStack grow={1} className={`${styles["hframe"]} ${className}`} {...rest}>
      {children}
    </HStack>
  );
}
