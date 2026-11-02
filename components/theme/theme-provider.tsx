"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const THEMES = ["dark", "light"];

/**
 * Keeps <meta name="theme-color"> (browser chrome on phones) in step with the
 * page colour. It reads `--ink` from app/globals.css, so no colour lives here.
 */
function ThemeColorSync() {
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const ink = window.getComputedStyle(root).getPropertyValue("--ink").trim();
      const meta = document.querySelector('meta[name="theme-color"]');
      if (ink && meta) meta.setAttribute("content", ink);
    };
    sync();
    const observer = new window.MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return null;
}

/**
 * Dark is the default and does not follow the OS. The choice is stored in
 * localStorage and applied as <html data-theme> by a blocking script before
 * first paint, so there is no flash of the wrong theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={THEMES}
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeColorSync />
      {children}
    </NextThemesProvider>
  );
}
