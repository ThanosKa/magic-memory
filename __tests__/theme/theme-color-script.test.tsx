import { describe, it, expect, beforeEach } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

import { ThemeColorScript } from "@/components/theme/theme-color-script"

/**
 * The browser chrome colour (<meta name="theme-color">) must match the page
 * before first paint, including for visitors who chose the light theme.
 */

function runScript(): void {
  const markup = renderToStaticMarkup(<ThemeColorScript />)
  const source = markup.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "")
  new Function(source)()
}

function themeColor(): string | null {
  return document.querySelector('meta[name="theme-color"]')?.getAttribute("content") ?? null
}

/** Stand-in for app/globals.css: --ink per theme, keyed on <html data-theme>. */
function applyTheme(theme: "dark" | "light"): void {
  const root = document.documentElement
  root.setAttribute("data-theme", theme)
  root.style.setProperty("--ink", theme === "light" ? "rgb(245, 240, 230)" : "rgb(13, 11, 9)")
}

describe("theme colour script", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="theme-color" content="rgb(13, 11, 9)">'
    document.documentElement.removeAttribute("data-theme")
    document.documentElement.removeAttribute("style")
  })

  it("matches the browser chrome to a stored light theme before paint", () => {
    applyTheme("light")
    runScript()
    expect(themeColor()).toBe("rgb(245, 240, 230)")
  })

  it("follows the theme when the visitor toggles it later", async () => {
    applyTheme("dark")
    runScript()
    applyTheme("light")
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(themeColor()).toBe("rgb(245, 240, 230)")
  })
})
