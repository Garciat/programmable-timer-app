import { FlexBox, FlexBoxProps } from "./FlexBox.tsx";

export type HStackProps = Omit<FlexBoxProps, "direction">;

export function HStack(props: HStackProps) {
  const { children, alignItems, justify, ...rest } = props;
  return (
    <FlexBox
      direction="row"
      alignItems={alignItems ?? "center"}
      justify={justify ?? "center"}
      {...rest}
    >
      {children}
    </FlexBox>
  );
}
