"use client";

import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react";

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={className}>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        aria-label={
          mounted
            ? isDark
              ? "Switch to light theme"
              : "Switch to dark theme"
            : "Toggle theme"
        }
        aria-pressed={isDark ? "true" : "false"}
        isDisabled={!mounted}
        onPress={() => setTheme(isDark ? "light" : "dark")}
        className={
          "size-7 min-w-7 shrink-0 rounded-md! p-0 text-fg-3 hover:bg-canvas-2! hover:text-fg-1!"
        }
      >
        {!mounted ? (
          <MoonIcon className="size-3.5 animate-pulse text-current opacity-40" />
        ) : isDark ? (
          <SunIcon className="size-3.5 text-current" />
        ) : (
          <MoonIcon className="size-3.5 text-current" />
        )}
      </Button>
    </div>
  );
}
