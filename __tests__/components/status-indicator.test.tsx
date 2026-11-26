import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { SWRConfig } from "swr"

import { StatusIndicator } from "@/components/status-indicator"

function feed({ aggregate, resource }: { aggregate: string; resource?: string }) {
  return {
    data: { attributes: { aggregate_state: aggregate } },
    included: [
      { type: "status_page_section", attributes: { name: null } },
      { type: "status_page_resource", attributes: { public_name: "Magic Room", status: "downtime" } },
      ...(resource ? [{ type: "status_page_resource", attributes: { public_name: "Magic Memory", status: resource } }] : []),
    ],
  }
}

let container: HTMLDivElement
let root: Root

async function mount(response: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(response))
  await act(async () => {
    root.render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <StatusIndicator />
      </SWRConfig>
    )
  })
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
  return container.querySelector("a")
}

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe("StatusIndicator", () => {
  it.each([
    ["operational", "All systems normal"],
    ["degraded", "Partial outage"],
    ["downtime", "Major outage"],
    ["maintenance", "Under maintenance"],
  ])("shows %s for this site as %s with a decorative dot", async (state, label) => {
    const link = await mount(() => Promise.resolve(Response.json(feed({ aggregate: "downtime", resource: state }))))

    expect(link?.textContent).toBe(label)
    expect(link?.querySelector("[aria-hidden='true']")).not.toBeNull()
    expect(link?.getAttribute("href")).toBe("https://thanoska.betteruptime.com")
    expect(link?.getAttribute("target")).toBe("_blank")
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer")
  })

  it("falls back to the page-wide state when this site is not listed", async () => {
    const link = await mount(() => Promise.resolve(Response.json(feed({ aggregate: "degraded" }))))

    expect(link?.textContent).toBe("Partial outage")
  })

  it.each([
    ["the request fails", () => Promise.reject(new TypeError("Failed to fetch"))],
    ["the feed answers 500", () => Promise.resolve(new Response("oops", { status: 500 }))],
    ["the state is unknown", () => Promise.resolve(Response.json(feed({ aggregate: "operational", resource: "sunny" })))],
    ["the body has another shape", () => Promise.resolve(Response.json({ ok: true }))],
  ])("shows a plain Status link with no dot when %s", async (_case, response) => {
    const link = await mount(response)

    expect(link?.textContent).toBe("Status")
    expect(link?.querySelector("[aria-hidden='true']")).toBeNull()
  })
})
