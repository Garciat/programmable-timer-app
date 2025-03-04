import { useMemo } from "react";
import { JSX } from "react/jsx-runtime";

import { FlexProps } from "lib/box/types.ts";

import styles from "./all.module.css";

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
    className,
    ...rest
  } = props;

  const Kind = kind ?? "div";

  const flexClasses = useMemo(() => [
    `display-flex`,
    ...(grow ? [`flex-grow-${grow}`] : []),
    ...(basis ? [`flex-basis-${basis}`] : []),
    ...(direction ? [`flex-direction-${direction}`] : []),
    ...(justify ? [`justify-content-${justify}`] : []),
    ...(alignItems ? [`align-items-${alignItems}`] : []),
    ...(gap ? [`gap-${gap.replace(".", "_")}`] : []),
    ...(alignContent ? [`align-content-${alignContent}`] : []),
    ...(wrap ? [`flex-wrap-${wrap}`] : []),
  ], [
    grow,
    basis,
    direction,
    justify,
    alignItems,
    alignContent,
    wrap,
    gap,
  ]);

  const flexClassName = useMemo(
    () => flexClasses.map(getFlexClassName).join(" "),
    [flexClasses],
  );

  const finalClassName = useMemo(() => `${flexClassName} ${className}`, [
    flexClassName,
    className,
  ]);

  return (
    <Kind className={finalClassName} {...rest}>
      {children}
    </Kind>
  );
}

function getFlexClassName(key: string) {
  if (!styles[key]) {
    throw new Error(`[FlexBox] Missing className: ${key}`);
  }
  return styles[key];
}
