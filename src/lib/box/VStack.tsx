import { FlexBox, FlexBoxProps } from "./FlexBox.tsx";

export type VStackProps = Omit<FlexBoxProps, "direction">;

export function VStack(props: VStackProps) {
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
