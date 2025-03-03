import { JSX } from "npm:react@19/jsx-runtime";
import { FlexProps } from "./css.ts";

export type BoxKind =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "nav"
  | "header"
  | "footer"
  | "main";

type BasicBoxProps = JSX.IntrinsicElements["div"];

export interface FlexBoxProps extends BasicBoxProps, FlexProps {
  kind?: BoxKind;
}

export function FlexBox(props: FlexBoxProps) {
  const {
    kind,
    grow,
    basis,
    direction,
    justify,
    alignItems,
    alignContent,
    wrap,
    gap,
    children,
    style,
    ...rest
  } = props;

  const Kind = kind ?? "div";

  return (
    <Kind
      style={{
        display: "flex",
        flexGrow: grow,
        flexBasis: basis,
        flexDirection: direction,
        justifyContent: justify,
        alignItems: alignItems,
        alignContent: alignContent,
        flexWrap: wrap,
        gap: gap instanceof CSSUnitValue
          ? `${gap}`
          : gap && `${gap.row} ${gap.column}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Kind>
  );
}
