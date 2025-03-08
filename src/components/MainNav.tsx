import { useLocation } from "react-router";
import { CalendarCheck, Timer } from "lucide-react";

import { HStack, VStack } from "lib/box/mod.ts";
import { ifClass } from "lib/utils/style.ts";
import { LinkButton } from "src/components/LinkButton.tsx";
import { routeHistory, routeHome } from "src/routes.ts";

import styles from "src/components/MainNav.module.css";

export function MainNav() {
  const location = useLocation();

  return (
    <HStack
      kind="nav"
      gap="1rem"
      className={styles["main-nav"]}
    >
      <LinkButton
        href={routeHome()}
        className={`${styles["link"]} ${
          ifClass(location.pathname === routeHome(), styles["active"])
        }`}
      >
        <VStack>
          <Timer size="1.5em" />
          <span>Presets</span>
        </VStack>
      </LinkButton>
      <LinkButton
        href={routeHistory()}
        className={`${styles["link"]} ${
          ifClass(location.pathname === routeHistory(), styles["active"])
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
