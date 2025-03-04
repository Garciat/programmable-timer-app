export interface FlexProps {
  grow?: 1;
  basis?: 0;
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
  gap?: "0.5rem" | "1rem" | "2rem";
}
