import classes from "./FullscreenLayout.module.css";

export interface FullscreenLayoutProps {
  children: React.ReactNode;
}

export function FullscreenLayout({ children }: FullscreenLayoutProps) {
  return (
    <main className={classes.layout}>
      {children}
    </main>
  );
}
