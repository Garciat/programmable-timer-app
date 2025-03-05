import { VStack, VStackProps } from "lib/box/VStack.tsx";

import styles from "lib/box/all.module.css";

export type VFrameProps = VStackProps;

export function VFrame(props: VFrameProps) {
  const { children, className, ...rest } = props;

  return (
    <VStack grow={1} className={`${styles["vframe"]} ${className}`} {...rest}>
      {children}
    </VStack>
  );
}
