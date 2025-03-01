import "./FullscreenLayout.css";

export interface FullscreenLayoutProps {
  children: React.ReactNode;
}

export function FullscreenLayout({ children }: FullscreenLayoutProps) {
  return (
    <main>
      {children}
    </main>
  );
}
