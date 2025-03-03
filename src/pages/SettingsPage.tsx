import { useNavigate } from "react-router";

import { VFrame } from "../lib/box/VFrame.tsx";
import { BaseLayout } from "./BaseLayout.tsx";
import { TitleBar, TitleBarText } from "../components/TitleBar.tsx";

import stylesAll from "./all.module.css";
import { NavButton } from "../components/NavButton.tsx";

export function SettingsPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  return (
    <BaseLayout>
      <TitleBar
        left={<NavButton icon="move-left" onClick={goBack} />}
        middle={<TitleBarText value="Settings" />}
      />
      <VFrame className={stylesAll["content-frame"]}>
        <p style={{ textAlign: "center" }}>No settings yet.</p>
      </VFrame>
    </BaseLayout>
  );
}
