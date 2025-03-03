export interface FlexProps {
  grow?: number;
  basis?: number | "auto";
  direction?: "row" | "column";
  justify?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around";
  alignItems?: "center" | "flex-start" | "flex-end" | "baseline" | "stretch";
  alignContent?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "stretch";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  gap?: string | { row: string; column: string };
}
