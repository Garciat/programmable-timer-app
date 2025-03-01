import "./BaseLayout.css";

export interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <main>
      {children}
    </main>
  );
}
