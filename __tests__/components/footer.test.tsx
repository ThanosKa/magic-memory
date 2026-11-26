import { describe, it, expect } from "vitest"
import { renderToString } from "react-dom/server"

import { Footer } from "@/components/footer"

describe("Footer", () => {
  it("links to the status page in a new tab", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToString(<Footer />)
    const status = [...host.querySelectorAll("a")].find((link) => link.textContent === "Status")

    expect(status?.getAttribute("href")).toBe("https://thanoska.betteruptime.com")
    expect(status?.getAttribute("target")).toBe("_blank")
    expect(status?.getAttribute("rel")).toBe("noopener noreferrer")
  })
})
