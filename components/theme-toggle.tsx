"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

type ThemeToggleProps = {
  /** When "inline", button is not fixed (for use inside header). Default "fixed". */
  variant?: "fixed" | "inline";
};

export function ThemeToggle({ variant = "fixed" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const isInline = variant === "inline";

  if (!mounted && !isInline) {
    return (
      <div
        className="fixed top-4 right-4 z-30 size-10 rounded-full bg-muted"
        aria-hidden
      />
    );
  }

  if (!mounted && isInline) {
    return <div className="size-8 flex-shrink-0 rounded-md bg-muted" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        isInline
          ? "flex size-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-opacity duration-150 ease-out hover:text-foreground hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
          : "fixed top-4 right-4 z-30 flex size-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-opacity duration-150 ease-out hover:text-foreground hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0"
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunIcon className="h-3.5 w-3.5 text-foreground" />
      ) : (
        <MoonIcon className="h-3.5 w-3.5 text-foreground" />
      )}
    </button>
  );
}
