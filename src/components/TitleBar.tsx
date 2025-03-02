import classes from "./TitleBar.module.css";

export interface TitleBarProps {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
}

export function TitleBar({ left, middle, right }: TitleBarProps) {
  return (
    <header className={classes["title-bar"]}>
      <div className={classes["left"]}>{left}</div>
      <div className={classes["middle"]}>{middle ?? <h1>&nbsp;</h1>}</div>
      <div className={classes["right"]}>{right}</div>
    </header>
  );
}
