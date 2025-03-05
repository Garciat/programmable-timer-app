import { HStack, HStackProps } from "lib/box/HStack.tsx";

import classes from "lib/box/all.module.css";

export type HFrameProps = HStackProps;

export function HFrame(props: HFrameProps) {
  const { children, className, ...rest } = props;

  return (
    <HStack grow={1} className={`${classes["hframe"]} ${className}`} {...rest}>
      {children}
    </HStack>
  );
}
