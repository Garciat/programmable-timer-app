import { useLocation } from "react-router";
import { CalendarCheck, Timer } from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { LinkButton } from "src/components/LinkButton.tsx";

import styles from "src/components/MainNav.module.css";
import { ifClass } from "lib/utils/style.ts";

export function MainNav() {
  const location = useLocation();

  return (
    <HStack
      kind="nav"
      justify="flex-start"
      gap="0.5rem"
      className={styles["main-nav"]}
    >
      <LinkButton
        href="/"
        className={`${styles["link"]} ${
          ifClass(location.pathname === "/", styles["active"])
        }`}
      >
        <VStack>
          <Timer size="1.5em" />
          <span>Presets</span>
        </VStack>
      </LinkButton>
      <LinkButton
        href="/history"
        className={`${styles["link"]} ${
          ifClass(location.pathname === "/history", styles["active"])
        }`}
      >
        <VStack>
          <CalendarCheck size="1.5em" />
          <span>History</span>
        </VStack>
      </LinkButton>
    </HStack>
  );
}
