import { HStack, HStackProps } from "./HStack.tsx";

import classes from "./all.module.css";

export type HFrameProps = HStackProps;

export function HFrame(props: HFrameProps) {
  const { children, className, ...rest } = props;

  return (
    <HStack grow={1} className={`${classes["hframe"]} ${className}`} {...rest}>
      {children}
    </HStack>
  );
}
