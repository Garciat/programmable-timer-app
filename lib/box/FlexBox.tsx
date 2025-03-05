import { useMemo } from "react";
import { JSX } from "react/jsx-runtime";

import { FlexProps } from "lib/box/types.ts";

import styles from "lib/box/all.module.css";

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
    prefix("flex-grow-", grow),
    prefix("flex-basis-", basis),
    prefix("flex-direction-", direction),
    prefix("justify-content-", justify),
    prefix("align-items-", alignItems),
    prefix("align-content-", alignContent),
    prefix("flex-wrap-", wrap),
    prefix("gap-", gap?.replace(".", "_")),
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

  const finalClassName = useMemo(() => `${flexClassName} ${className ?? ""}`, [
    flexClassName,
    className,
  ]);

  return (
    <Kind className={finalClassName} {...rest}>
      {children}
    </Kind>
  );
}

function prefix(
  prefix: string,
  value: string | number | undefined,
): string | undefined {
  return value === undefined ? undefined : `${prefix}${value}`;
}

function getFlexClassName(key: string | undefined): string {
  if (key === undefined) {
    return "";
  }
  if (!styles[key]) {
    throw new Error(`[FlexBox] Missing className: ${key}`);
  }
  return styles[key];
}
