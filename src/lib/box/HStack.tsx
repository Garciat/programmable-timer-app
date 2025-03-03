import { FlexBox, FlexBoxProps } from "./FlexBox.tsx";

export type HStackProps = Omit<FlexBoxProps, "direction">;

export function HStack(props: HStackProps) {
  const { children, ...rest } = props;
  return (
    <FlexBox
      direction="column"
      alignItems="stretch"
      justify="flex-start"
      {...rest}
    >
      {children}
    </FlexBox>
  );
}
