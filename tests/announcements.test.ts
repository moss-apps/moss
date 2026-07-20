import { describe, expect, it } from "vitest"
import { announcementReadUrl } from "@/hooks/useAnnouncements"
import { excerpt } from "@/lib/announcements"

describe("announcementReadUrl", () => {
  const BASE = "https://db.example.co"

  it("always filters to published rows", () => {
    for (const id of ["all", "latest", "some-uuid"] as const) {
      expect(announcementReadUrl(BASE, id)).toContain("published=eq.true")
    }
  })

  it("scopes a single announcement by id", () => {
    expect(announcementReadUrl(BASE, "some-uuid")).toContain("id=eq.some-uuid")
  })

  it("url-encodes the id rather than treating it as raw", () => {
    expect(announcementReadUrl(BASE, "a b")).toContain("id=eq.a%20b")
  })
})

describe("excerpt", () => {
  it("strips headings, bold, and links to plain text", () => {
    expect(excerpt("## Heading\n\nSome **bold** text.", 100)).toBe(
      "Heading Some bold text.",
    )
  })

  it("truncates long text with an ellipsis", () => {
    expect(excerpt("Some **bold** text and a [link](https://x.co) here.", 30)).toBe(
      "Some bold text and a link here…",
    )
  })

  it("returns the full text when under the limit", () => {
    expect(excerpt("short body", 100)).toBe("short body")
  })
})