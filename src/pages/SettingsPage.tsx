import { MoveLeft } from "lucide-react";

import { VFrame } from "../lib/box/mod.ts";
import { BaseLayout } from "./BaseLayout.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";

export function SettingsPage() {
  return (
    <BaseLayout>
      <TitleBar
        left={
          <IconButton
            icon={MoveLeft}
            href="/"
            transitions={["from-left-backwards"]}
          />
        }
        middle={<TitleBarText value="Settings" />}
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        className={stylesAll["content-frame"]}
      >
        <p style={{ textAlign: "center" }}>No settings yet.</p>
      </VFrame>
    </BaseLayout>
  );
}
