import { FlexBox, FlexBoxProps } from "lib/box/FlexBox.tsx";

export type VStackProps = Omit<FlexBoxProps, "direction">;

export function VStack(props: VStackProps) {
  const { children, alignItems, justify, ...rest } = props;
  return (
    <FlexBox
      direction="column"
      alignItems={alignItems ?? "center"}
      justify={justify ?? "center"}
      {...rest}
    >
      {children}
    </FlexBox>
  );
}
