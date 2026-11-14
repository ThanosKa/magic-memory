import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { SWRConfig } from "swr"

import { RestoreUploader } from "@/components/restore/restore-uploader"

const toastError = vi.fn()
vi.mock("sonner", () => ({ toast: { error: (...args: unknown[]) => toastError(...args) } }))

let capturedOnDrop: ((files: File[], rejected: unknown[]) => Promise<void>) | null = null
vi.mock("react-dropzone", () => ({
  useDropzone: (options: { onDrop: typeof capturedOnDrop }) => {
    capturedOnDrop = options.onDrop
    return {
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: false,
    }
  },
}))

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}))

const CREDITS_ERROR = "We couldn't load your credits."

function jsonResponse(body: unknown): Response {
  return { json: () => Promise.resolve(body) } as Response
}

let container: HTMLDivElement
let root: Root
let creditsHandler: () => Promise<Response>
let creditsCalls: number

async function flush() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

async function mountWithPhoto() {
  await act(async () => {
    root.render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}>
        <RestoreUploader />
      </SWRConfig>
    )
  })
  await act(async () => {
    await capturedOnDrop!([new File(["x"], "old.jpg", { type: "image/jpeg" })], [])
  })
  await flush()
}

function text() {
  return container.textContent ?? ""
}

function buttonLabelled(label: string) {
  return Array.from(container.querySelectorAll("button")).find((b) =>
    b.textContent?.includes(label)
  )
}

beforeEach(() => {
  toastError.mockClear()
  creditsCalls = 0
  creditsHandler = () => new Promise<Response>(() => {})
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (url === "/api/credits") {
        creditsCalls += 1
        return creditsHandler()
      }
      return Promise.reject(new Error(`unexpected fetch ${url}`))
    })
  )
  class FakeImage {
    width = 100
    height = 100
    onload: (() => void) | null = null
    set src(_value: string) {
      void Promise.resolve().then(() => this.onload?.())
    }
  }
  vi.stubGlobal("Image", FakeImage)
  ;(window as unknown as { Image: unknown }).Image = FakeImage
  URL.createObjectURL = vi.fn(() => "blob:preview")
  URL.revokeObjectURL = vi.fn()
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe("RestoreUploader credits states", () => {
  it("says nothing about credits and offers no restore while the Balance is loading", async () => {
    await mountWithPhoto()

    expect(text()).not.toContain("Out of credits")
    expect(text()).not.toContain(CREDITS_ERROR)
    expect(container.querySelector('a[href="/pricing"]')).toBeNull()
    expect(buttonLabelled("Restore Photo")).toBeUndefined()
  })

  it.each([
    ["success false", () => Promise.resolve(jsonResponse({ success: false, error: "db down" }))],
    ["a network failure", () => Promise.reject(new Error("offline"))],
  ])("shows the load failure and a retry on %s", async (_name, handler) => {
    creditsHandler = handler
    await mountWithPhoto()

    expect(text()).toContain(CREDITS_ERROR)
    expect(text()).not.toContain("Out of credits")
    expect(container.querySelector('a[href="/pricing"]')).toBeNull()
    expect(buttonLabelled("Restore Photo")).toBeUndefined()
    expect(buttonLabelled("Try Again")).toBeDefined()
  })

  it("requests the Balance again on Try Again and recovers", async () => {
    creditsHandler = () => Promise.resolve(jsonResponse({ success: false, error: "db down" }))
    await mountWithPhoto()
    const before = creditsCalls

    creditsHandler = () =>
      Promise.resolve(jsonResponse({ success: true, data: { totalCredits: 2 } }))
    await act(async () => {
      buttonLabelled("Try Again")!.click()
    })
    await flush()

    expect(creditsCalls).toBeGreaterThan(before)
    expect(text()).not.toContain(CREDITS_ERROR)
    expect(buttonLabelled("Restore Photo")).toBeDefined()
  })

  it("toasts a failed credits request once", async () => {
    creditsHandler = () => Promise.resolve(jsonResponse({ success: false, error: "db down" }))
    await mountWithPhoto()

    expect(toastError).toHaveBeenCalledTimes(1)
  })

  it("shows the out-of-credits state for a known Balance of 0", async () => {
    creditsHandler = () =>
      Promise.resolve(jsonResponse({ success: true, data: { totalCredits: 0 } }))
    await mountWithPhoto()

    expect(text()).toContain("Out of credits")
    expect(container.querySelector('a[href="/pricing"]')).not.toBeNull()
    expect(text()).not.toContain(CREDITS_ERROR)
    expect(buttonLabelled("Restore Photo")).toBeUndefined()
  })

  it("allows restoring with a known Balance of 1 or more", async () => {
    creditsHandler = () =>
      Promise.resolve(jsonResponse({ success: true, data: { totalCredits: 1 } }))
    await mountWithPhoto()

    expect(text()).not.toContain("Out of credits")
    expect(text()).not.toContain(CREDITS_ERROR)
    expect(buttonLabelled("Restore Photo")).toBeDefined()
  })
})
