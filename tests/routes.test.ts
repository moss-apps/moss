import { describe, expect, it } from "vitest"
import { isKnownRoute } from "@/lib/routes"

describe("isKnownRoute", () => {
  it.each([
    "/",
    "/changelog",
    "/downloads",
    "/announcements",
    "/announcements/some-announcement-id",
    "/community",
    "/community/readme",
    "/community/code-of-conduct",
    "/flick",
    "/latch",
    "/contact",
    "/search",
    "/admin",
  ])("accepts %s", (path) => {
    expect(isKnownRoute(path)).toBe(true)
  })

  it("tolerates trailing slashes", () => {
    expect(isKnownRoute("/downloads/")).toBe(true)
    expect(isKnownRoute("/community/readme/")).toBe(true)
  })

  it.each([
    "/nope",
    "/admin/secret",
    "/flick/extra",
    "/search/anything",
    "/announcements/a/b",
    "/community/a/b",
    "/announcement",
  ])("rejects %s", (path) => {
    expect(isKnownRoute(path)).toBe(false)
  })
})
