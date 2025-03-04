import { FlexBox, FlexBoxProps } from "./FlexBox.tsx";

export type VStackProps = Omit<FlexBoxProps, "direction">;

export function VStack(props: VStackProps) {
  const { children, alignItems, justify, ...rest } = props;
  return (
    <FlexBox
      direction="column"
      alignItems={alignItems ?? "stretch"}
      justify={justify ?? "flex-start"}
      {...rest}
    >
      {children}
    </FlexBox>
  );
}
