import { Button } from "tabler-react-ui";
import { IconMoon, IconSun } from "@tabler/icons-react";

/**
 * Theme switcher component for toggling between light and dark modes
 */
export function ThemeSwitcher() {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hide-theme-dark"
        title="Enable dark mode"
        onClick={() => (document.documentElement.dataset.bsTheme = "dark")}
      >
        <IconMoon size={18} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hide-theme-light"
        title="Enable light mode"
        onClick={() => (document.documentElement.dataset.bsTheme = "light")}
      >
        <IconSun size={18} />
      </Button>
    </>
  );
}
