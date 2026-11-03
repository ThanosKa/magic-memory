import { describe, it, expect } from "vitest"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

/**
 * Motion guard: people who ask for reduced motion get no entrance animations.
 *
 * - Every CSS animation declared in the theme file is switched off inside a
 *   `prefers-reduced-motion: reduce` block.
 * - Every component that uses Framer Motion opts into the user's setting
 *   (`useReducedMotion()` or `<MotionConfig reducedMotion="user">`).
 *
 * Spinners and skeleton pulses use Tailwind utilities and stay on: they show
 * that work is happening, which reduced motion should not hide.
 */

const ROOT = path.resolve(__dirname, "../..")
const THEME_FILE = "app/globals.css"
const SCANNED_DIRS = ["app", "components"]
const REDUCED_MOTION = /prefers-reduced-motion:\s*reduce/

type CssRule = { selector: string; body: string; reduced: boolean }

/** Flattens nested CSS into style rules, noting which sit in a reduced-motion block. */
function parseCss(css: string): CssRule[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const rules: CssRule[] = []
  const stack: { prelude: string; body: string }[] = []
  let buffer = ""

  for (const char of source) {
    if (char === "{") {
      stack.push({ prelude: buffer.trim(), body: "" })
      buffer = ""
    } else if (char === "}") {
      const block = stack.pop()
      if (!block) continue
      block.body += buffer
      buffer = ""
      const parents = stack.map((entry) => entry.prelude)
      const isKeyframe = parents.some((p) => p.startsWith("@keyframes"))
      if (!block.prelude.startsWith("@") && !isKeyframe) {
        rules.push({
          selector: block.prelude.replace(/\s+/g, " "),
          body: block.body,
          reduced: parents.some((p) => REDUCED_MOTION.test(p)),
        })
      }
    } else if (char === ";" && stack.length > 0) {
      stack[stack.length - 1].body += buffer + ";"
      buffer = ""
    } else {
      buffer += char
    }
  }
  return rules
}

function animationOf(body: string): string | null {
  const match = body.match(/(?:^|;)\s*animation(?:-name)?\s*:\s*([^;]+)/)
  return match ? match[1].trim() : null
}

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.tsx?$/.test(entry.name)) out.push(full)
  }
}

describe("motion guard", () => {
  it("turns off every theme-file animation when reduced motion is on", () => {
    const rules = parseCss(readFileSync(path.join(ROOT, THEME_FILE), "utf8"))
    const animated = rules.filter((rule) => {
      const value = animationOf(rule.body)
      return !rule.reduced && value !== null && value !== "none"
    })
    const switchedOff = new Set(
      rules
        .filter((rule) => rule.reduced && animationOf(rule.body) === "none")
        .flatMap((rule) => rule.selector.split(",").map((s) => s.trim()))
    )

    const missing = animated
      .flatMap((rule) => rule.selector.split(",").map((s) => s.trim()))
      .filter((selector) => !switchedOff.has(selector))

    expect(animated.length).toBeGreaterThan(0)
    expect(missing, "add `animation: none` for these under prefers-reduced-motion").toEqual([])
  })

  it("makes every Framer Motion component follow the reduced-motion setting", () => {
    const files: string[] = []
    for (const dir of SCANNED_DIRS) {
      const abs = path.join(ROOT, dir)
      if (existsSync(abs)) walk(abs, files)
    }

    const offenders = files
      .filter((file) => {
        const source = readFileSync(file, "utf8")
        if (!/from ["'](?:framer-motion|motion\/react)["']/.test(source)) return false
        return !/useReducedMotion\(\)|reducedMotion="user"/.test(source)
      })
      .map((file) => path.relative(ROOT, file).split(path.sep).join("/"))

    expect(offenders).toEqual([])
  })
})
