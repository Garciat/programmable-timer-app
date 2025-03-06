import { useLocation } from "react-router";
import { CalendarCheck, Timer } from "lucide-react";

import { HStack } from "lib/box/mod.ts";
import { LinkButton } from "src/components/LinkButton.tsx";

export function MainNav() {
  const location = useLocation();

  return (
    <HStack kind="nav" justify="flex-start" gap="0.5rem">
      <LinkButton href="/" active={location.pathname === "/"}>
        <Timer />
        <span>Presets</span>
      </LinkButton>
      <LinkButton href="/history" active={location.pathname === "/history"}>
        <CalendarCheck />
        <span>History</span>
      </LinkButton>
    </HStack>
  );
}
