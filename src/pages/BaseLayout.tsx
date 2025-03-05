import { useEffect } from "react";
import { VStack } from "lib/box/mod.ts";

import classes from "./BaseLayout.module.css";

export interface BaseLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function BaseLayout({ title, children }: BaseLayoutProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

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
