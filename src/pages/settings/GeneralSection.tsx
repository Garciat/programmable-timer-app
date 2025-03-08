import { MonitorCog } from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { InstallSubsection } from "src/pages/settings/InstallSubsection.tsx";

export function GeneralSection() {
  return (
    <VStack kind="section">
      <HStack kind="header">
        <MonitorCog />
        <h2>General</h2>
      </HStack>
      <InstallSubsection />
      <VStack kind="article">
        <HStack kind="header">
          <h3>Browser Language</h3>
        </HStack>
        <input
          type="text"
          value={navigator.language}
          readOnly
          disabled
        />
      </VStack>
    </VStack>
  );
}
