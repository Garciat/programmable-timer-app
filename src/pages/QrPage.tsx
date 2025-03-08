import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MoveLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { VFrame } from "lib/box/mod.ts";
import { generateShareURL } from "src/app/share.ts";
import { useAppPreset } from "src/state/context.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { TitleBar, TitleBarText } from "src/components/TitleBar.tsx";
import { BaseLayout } from "src/pages/BaseLayout.tsx";

import stylesAll from "src/pages/all.module.css";
import { routeHome } from "src/routes.ts";

export function QrPage() {
  const { presetId } = useParams();
  const [preset] = useAppPreset(presetId ?? "");

  const [shareURL, setShareURL] = useState("");

  useEffect(() => {
    if (preset) {
      generateShareURL(preset).then(setShareURL);
    }
  }, [preset]);

  return (
    <BaseLayout title="Share Preset">
      <TitleBar
        left={
          <IconButton
            icon={MoveLeft}
            href={routeHome()}
          />
        }
        middle={
          <TitleBarText
            value={preset ? `Share: ${preset.name}` : "Not Found"}
          />
        }
      />
      <VFrame className={stylesAll["content-frame"]}>
        <QRCodeSVG
          value={shareURL}
          size={300}
          style={{ border: "2rem solid white" }}
        />
      </VFrame>
    </BaseLayout>
  );
}
