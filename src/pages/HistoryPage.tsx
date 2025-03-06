import { Calculator, Menu, Timer, Wrench } from "lucide-react";

import { HStack, VFrame } from "lib/box/mod.ts";
import { BaseLayout } from "src/pages/BaseLayout.tsx";
import { IconButton } from "src/components/IconButton.tsx";
import { MainNav } from "src/components/MainNav.tsx";
import { TitleBar } from "src/components/TitleBar.tsx";

import stylesAll from "src/pages/all.module.css";

export function HistoryPage() {
  return (
    <BaseLayout title="Programmable Timer">
      <TitleBar
        left={
          <IconButton
            icon={Menu}
            href="/settings"
            transitions={["from-left"]}
          />
        }
        middle={
          <>
            <Calculator size={24} />
            <Timer size={24} />
          </>
        }
      />
      <VFrame
        alignItems="stretch"
        justify="flex-start"
        gap="2rem"
        className={stylesAll["content-frame"]}
      >
        <HStack gap="1rem">
          <Wrench /> <span>Work in progress!</span>
        </HStack>
      </VFrame>
      <MainNav />
    </BaseLayout>
  );
}
