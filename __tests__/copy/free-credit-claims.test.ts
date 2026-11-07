import { describe, it, expect } from "vitest"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

/**
 * The daily free credit was removed on purpose. Anything a visitor can read
 * must not promise it back: a user who trusts the claim hits a 403.
 */

const ROOT = path.resolve(__dirname, "../..")
const SCANNED_DIRS = ["app", "components", "lib", "public"]
const SCANNED_EXTENSIONS = [".ts", ".tsx", ".md", ".txt"]
const REMOVED_PROMISE =
  /free daily|daily free|free restorations? (daily|per day|every day)|1 restoration per day|free per day|resets? (daily|at midnight)|midnight UTC/i

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full)
    return SCANNED_EXTENSIONS.includes(path.extname(entry.name)) ? [full] : []
  })
}

describe("removed daily free credit", () => {
  it("is not promised anywhere a visitor can read", () => {
    const offenders = SCANNED_DIRS.flatMap((dir) => listFiles(path.join(ROOT, dir))).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, index) =>
          REMOVED_PROMISE.test(line) ? [`${path.relative(ROOT, file)}:${index + 1}`] : [],
        ),
    )

    expect(offenders).toEqual([])
  })
})
