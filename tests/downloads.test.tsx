import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router"
import { Downloads } from "@/pages/Downloads"
import { useGitHubReleases } from "@/hooks/useGitHubReleases"

vi.mock("@/hooks/useGitHubReleases", () => ({
  useGitHubReleases: vi.fn(),
}))

vi.mock("@/components/PlasmaWave", () => ({ PlasmaWave: () => null }))

describe("Latch downloads", () => {
  it.each([
    { state: "loading", isLoading: true, error: undefined },
    { state: "empty", isLoading: false, error: undefined },
    { state: "failed", isLoading: false, error: new Error("GitHub unavailable") },
  ])("keeps downloads available when stats are $state", ({ isLoading, error }) => {
    vi.mocked(useGitHubReleases).mockReturnValue({ releases: [], isLoading, error })
    const container = document.createElement("div")
    container.innerHTML = renderToStaticMarkup(
      <MemoryRouter>
        <Downloads />
      </MemoryRouter>,
    )
    const section = container.querySelector('[aria-labelledby="latch-download-title"]')!
    const links = [...section.querySelectorAll("a")]
    const base = "https://github.com/moss-apps/Latch/releases/download/0.18.0-beta.1/"

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      `${base}latch_0.18.0-beta.1_official.apk`,
      `${base}latchd-linux-amd64`,
      `${base}latchd-linux-arm64`,
      `${base}latchd-windows-amd64.exe`,
      "https://github.com/moss-apps/Latch/releases/tag/0.18.0-beta.1",
    ])
    expect(section.textContent).toContain("Beta")
    expect(section.textContent).toContain("Mobile app")
    expect(section.textContent).toContain("Desktop companion")
  })
})
