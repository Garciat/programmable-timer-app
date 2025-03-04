import { VStack, VStackProps } from "lib/box/VStack.tsx";

import classes from "./all.module.css";

export type VFrameProps = VStackProps;

export function VFrame(props: VFrameProps) {
  const { children, className, ...rest } = props;

  return (
    <VStack grow={1} className={`${classes["vframe"]} ${className}`} {...rest}>
      {children}
    </VStack>
  );
}
