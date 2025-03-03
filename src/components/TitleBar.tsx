import { FlexBox } from "../lib/box/FlexBox.tsx";
import classes from "./TitleBar.module.css";

export interface TitleBarProps {
  left?: React.ReactNode;
  middle: React.ReactNode;
  right?: React.ReactNode;
}

export function TitleBar({ left, middle, right }: TitleBarProps) {
  return (
    <FlexBox kind="header" gap={CSS.rem(1)} className={classes["title-bar"]}>
      <FlexBox
        direction="row"
        alignItems="center"
        justify="flex-start"
      >
        {left}
      </FlexBox>
      <FlexBox
        direction="row"
        alignItems="center"
        justify="center"
        grow={1}
        className={classes["title-bar-middle"]}
      >
        {middle}
      </FlexBox>
      <FlexBox
        direction="row"
        alignItems="center"
        justify="flex-end"
      >
        {right}
      </FlexBox>
    </FlexBox>
  );
}

export function TitleBarText({ value }: { value: string }) {
  return <h1>{value}</h1>;
}
