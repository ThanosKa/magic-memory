import { describe, it, expect, vi, beforeEach } from "vitest"
import { restorePhoto } from "@/lib/restore/restorer"

vi.mock("@/lib/logger")

const VERSION = "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c"
const photo = { bytes: Buffer.from("test"), mimeType: "image/jpeg" }

function fakeClient(statuses: Array<Record<string, unknown>>) {
  const get = vi.fn()
  statuses.forEach((s) => get.mockResolvedValueOnce(s))
  const create = vi.fn().mockResolvedValue({ id: "pred-1", status: "starting" })
  return { client: { predictions: { create, get } }, create, get }
}

describe("restorePhoto", () => {
  const sleep = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => sleep.mockClear())

  it("returns the URL when the first poll succeeds", async () => {
    const { client } = fakeClient([{ status: "succeeded", output: "https://r/1.png" }])
    await expect(restorePhoto(photo, { client, sleep })).resolves.toBe("https://r/1.png")
    expect(sleep).not.toHaveBeenCalled()
  })

  it("keeps polling until the prediction succeeds", async () => {
    const { client, get } = fakeClient([
      { status: "starting" },
      { status: "processing" },
      { status: "processing" },
      { status: "succeeded", output: "https://r/2.png" },
    ])
    await expect(restorePhoto(photo, { client, sleep })).resolves.toBe("https://r/2.png")
    expect(get).toHaveBeenCalledTimes(4)
    expect(get).toHaveBeenCalledWith("pred-1")
    expect(sleep).toHaveBeenCalledTimes(3)
    expect(sleep).toHaveBeenCalledWith(1000)
  })

  it("throws with the Replicate message when the prediction fails", async () => {
    const { client } = fakeClient([{ status: "failed", error: "model crashed" }])
    await expect(restorePhoto(photo, { client, sleep })).rejects.toThrow(
      "Restoration failed: model crashed",
    )
  })

  it("throws when the prediction is canceled", async () => {
    const { client } = fakeClient([{ status: "canceled" }])
    await expect(restorePhoto(photo, { client, sleep })).rejects.toThrow(
      "Restoration failed: canceled",
    )
  })

  it("times out after maxAttempts polls", async () => {
    const { client, get } = fakeClient([])
    get.mockResolvedValue({ status: "processing" })
    await expect(restorePhoto(photo, { client, sleep, maxAttempts: 5 })).rejects.toThrow(
      "Restoration timed out after 60 seconds",
    )
    expect(get).toHaveBeenCalledTimes(5)
  })

  it("sends the model version, parameters and a data URL to create", async () => {
    const { client, create } = fakeClient([{ status: "succeeded", output: "u" }])
    await restorePhoto(photo, { client, sleep })
    expect(create).toHaveBeenCalledWith({
      version: VERSION,
      input: {
        img: `data:image/jpeg;base64,${Buffer.from("test").toString("base64")}`,
        version: "v1.4",
        scale: 2,
      },
    })
  })
})
