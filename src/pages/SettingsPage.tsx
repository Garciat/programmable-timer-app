import { MoveLeft } from "lucide-react";

import { VFrame } from "../lib/box/VFrame.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { NavButton } from "../components/NavButton.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function SettingsPage() {
  return (
    <BaseLayout>
      <TitleBar
        left={
          <NavButton
            icon={MoveLeft}
            href="/"
            transitions={["from-left-backwards"]}
          />
        }
        middle={<TitleBarText value="Settings" />}
      />
      <VFrame className={stylesAll["content-frame"]}>
        <p style={{ textAlign: "center" }}>No settings yet.</p>
      </VFrame>
    </BaseLayout>
  );
}
