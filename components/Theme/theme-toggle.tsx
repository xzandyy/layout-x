"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@gravity-ui/icons";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react";

const noopSubscribe = () => () => {};

function useIsHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useIsHydrated();

  const isDark = hydrated && resolvedTheme === "dark";

  return (
    <div className={className}>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        aria-label={
          hydrated
            ? isDark
              ? "Switch to light theme"
              : "Switch to dark theme"
            : "Toggle theme"
        }
        aria-pressed={isDark ? "true" : "false"}
        isDisabled={!hydrated}
        onPress={() => setTheme(isDark ? "light" : "dark")}
        className={
          "size-7 min-w-7 shrink-0 rounded-md! p-0 text-fg-3 hover:bg-canvas-2! hover:text-fg-1!"
        }
      >
        {!hydrated ? (
          <Moon
            className="size-3.5 animate-pulse text-current opacity-40"
            aria-hidden
          />
        ) : isDark ? (
          <Sun className="size-3.5 text-current" aria-hidden />
        ) : (
          <Moon className="size-3.5 text-current" aria-hidden />
        )}
      </Button>
    </div>
  );
}
