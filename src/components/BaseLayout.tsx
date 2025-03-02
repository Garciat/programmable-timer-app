import classes from "./BaseLayout.module.css";

export interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <main className={classes.layout}>
      {children}
    </main>
  );
}
