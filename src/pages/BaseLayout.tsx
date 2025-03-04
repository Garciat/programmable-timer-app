import { VStack } from "../lib/box/VStack.tsx";

import classes from "./BaseLayout.module.css";

export interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <VStack
      kind="main"
      grow={1}
      alignItems="stretch"
      className={classes.layout}
    >
      {children}
    </VStack>
  );
}
