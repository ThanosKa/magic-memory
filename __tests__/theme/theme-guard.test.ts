import { describe, it, expect } from "vitest"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

/**
 * Theme guard: keeps the single "darkroom" theme from drifting.
 *
 * Colours live in one place (THEME_FILE). Components and pages must use token
 * classes (bg-ink, text-paper/60, border-border, ring-ember, ...), never raw hex
 * colours or the retired palette.
 *
 * Files that have not been migrated yet are listed in ALLOWLIST_FILE, one path
 * per line. When you migrate a file, delete its line. When the list is empty
 * the guard covers the whole app.
 */

const ROOT = path.resolve(__dirname, "../..")
const THEME_FILE = "app/globals.css"
const ALLOWLIST_FILE = "__tests__/theme/theme-guard-allowlist.txt"
const SCANNED_DIRS = ["app", "components"]
const SCANNED_EXTENSIONS = [".ts", ".tsx", ".css"]

type Rule = { name: string; pattern: RegExp }

const RULES: Rule[] = [
  {
    name: "raw hex colour (use a theme token)",
    // `(?<![&\w])` skips HTML entities such as &#8217;
    pattern: /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g,
  },
  {
    name: "retired purple accent",
    pattern: /\b(?:purple|violet|indigo|fuchsia)-\d{2,3}\b/g,
  },
  {
    name: "white/black utility colour (use paper/ink)",
    pattern:
      /\b(?:bg|text|border|from|via|to|ring|fill|stroke|outline|divide|decoration|placeholder|caret|accent|shadow)-(?:white|black)\b/g,
  },
  {
    name: "dark: variant (there is only one theme)",
    pattern: /(?<![\w-])dark:/g,
  },
]

/**
 * Permanent, documented exceptions: exact snippets that may contain a raw
 * colour because they are not UI theme colours. Keep this list short.
 */
const EXCEPTIONS: { file: string; snippet: string; reason: string }[] = [
  {
    file: "app/layout.tsx",
    snippet: 'themeColor: "#0d0b09"',
    reason: "<meta name=theme-color> needs a literal; it equals --ink",
  },
  {
    file: "components/restore/restore-uploader.tsx",
    snippet: 'ctx.fillStyle = "#FFFFFF"',
    reason: "canvas background when flattening an upload; image data, not UI",
  },
]

function toPosix(p: string): string {
  return p.split(path.sep).join("/")
}

function listScannedFiles(): string[] {
  return SCANNED_DIRS.flatMap((dir) =>
    readdirSync(path.join(ROOT, dir), { recursive: true, encoding: "utf8" })
      .map((rel) => toPosix(path.join(dir, rel)))
      .filter((file) => SCANNED_EXTENSIONS.includes(path.extname(file)))
      .filter((file) => file !== THEME_FILE)
  ).sort()
}

function readAllowlist(): string[] {
  return readFileSync(path.join(ROOT, ALLOWLIST_FILE), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"))
}

function findViolations(file: string): string[] {
  let source = readFileSync(path.join(ROOT, file), "utf8")
  for (const exception of EXCEPTIONS) {
    if (exception.file === file) source = source.split(exception.snippet).join("")
  }

  return source.split("\n").flatMap((line, i) =>
    RULES.flatMap((rule) =>
      Array.from(line.matchAll(rule.pattern), (match) => `${file}:${i + 1}  ${match[0]}  (${rule.name})`)
    )
  )
}

describe("theme guard", () => {
  it("finds no raw hex colours or retired palette outside the theme file", () => {
    const allowlist = new Set(readAllowlist())
    const violations = listScannedFiles()
      .filter((file) => !allowlist.has(file))
      .flatMap(findViolations)

    expect(violations, `Use theme tokens from ${THEME_FILE} instead`).toEqual([])
  })

  it("keeps the allowlist honest: every entry exists and still needs migrating", () => {
    const stale = readAllowlist().filter(
      (file) => !existsSync(path.join(ROOT, file)) || findViolations(file).length === 0
    )

    expect(stale, `Remove these lines from ${ALLOWLIST_FILE}`).toEqual([])
  })

  it("keeps every documented exception in use", () => {
    const unused = EXCEPTIONS.filter(
      ({ file, snippet }) =>
        !existsSync(path.join(ROOT, file)) || !readFileSync(path.join(ROOT, file), "utf8").includes(snippet)
    ).map(({ file, snippet }) => `${file}: ${snippet}`)

    expect(unused, "Remove these entries from EXCEPTIONS").toEqual([])
  })

  it("declares one dark theme with no light variant", () => {
    const theme = readFileSync(path.join(ROOT, THEME_FILE), "utf8")

    expect(theme).toMatch(/color-scheme:\s*dark/)
    expect(theme).not.toMatch(/@custom-variant\s+dark/)
    expect(theme).not.toMatch(/^\s*\.dark\s*\{/m)
  })
})
