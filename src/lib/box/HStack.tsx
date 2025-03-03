import { FlexBox, FlexBoxProps } from "./FlexBox.tsx";

export type HStackProps = Omit<FlexBoxProps, "direction"> & {
  scrollable?: boolean;
};

export function HStack(props: HStackProps) {
  const { scrollable, children, style, ...rest } = props;
  return (
    <FlexBox
      direction="column"
      alignItems="stretch"
      justify="flex-start"
      style={{
        overflowX: scrollable ? "auto" : "visible",
        ...style,
      }}
      {...rest}
    >
      {children}
    </FlexBox>
  );
}
