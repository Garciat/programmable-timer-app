import { HStack } from "lib/box/mod.ts";
import { ifClass } from "src/utils/style.ts";

import classes from "./TitleBar.module.css";

export interface TitleBarProps {
  left?: React.ReactNode;
  middle: React.ReactNode;
  right?: React.ReactNode;
  hideShadow?: boolean;
}

export function TitleBar({ left, middle, right, hideShadow }: TitleBarProps) {
  return (
    <HStack
      kind="header"
      gap="1rem"
      className={`${classes["title-bar"]} ${
        ifClass(hideShadow, classes["hide-shadow"])
      }`}
    >
      <HStack justify="flex-start" grow={1} basis={0}>
        {left}
      </HStack>
      {/* https://stackoverflow.com/a/26535469/612169 */}
      <HStack style={{ minWidth: 0 }}>
        {middle}
      </HStack>
      <HStack justify="flex-end" grow={1} basis={0}>
        {right}
      </HStack>
    </HStack>
  );
}

export function TitleBarText({ value }: { value: string }) {
  return <h1 className={classes["title-bar-title"]}>{value}</h1>;
}
