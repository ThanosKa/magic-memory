import { describe, it, expect } from "vitest"
import { clerkAppearance } from "@/lib/theme/clerk-appearance"

describe("clerkAppearance", () => {
  it("reads every colour from palette variables, never literals", () => {
    const colors = Object.entries(clerkAppearance.variables ?? {}).filter(
      ([key]) => key.startsWith("color")
    )
    expect(colors.length).toBeGreaterThan(0)
    for (const [, value] of colors) {
      expect(String(value)).toMatch(/^var\(--[\w-]+\)$/)
    }
  })
})
