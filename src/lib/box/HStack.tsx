import { FlexBox, FlexBoxProps } from "./FlexBox.tsx";

export type HStackProps = Omit<FlexBoxProps, "direction">;

export function HStack(props: HStackProps) {
  const { children, alignItems, justify, ...rest } = props;
  return (
    <FlexBox
      direction="row"
      alignItems={alignItems ?? "stretch"}
      justify={justify ?? "flex-start"}
      {...rest}
    >
      {children}
    </FlexBox>
  );
}
