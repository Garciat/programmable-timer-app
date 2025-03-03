import { FlexBox, FlexBoxProps } from "./FlexBox.tsx";

export type VStackProps = Omit<FlexBoxProps, "direction"> & {
  scrollable?: boolean;
};

export function VStack(props: VStackProps) {
  const { scrollable, children, style, ...rest } = props;
  return (
    <FlexBox
      direction="column"
      alignItems="stretch"
      justify="flex-start"
      style={{
        overflowY: scrollable ? "auto" : "visible",
        ...style,
      }}
      {...rest}
    >
      {children}
    </FlexBox>
  );
}
