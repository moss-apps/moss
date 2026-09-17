import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router"
import { NotFound } from "@/pages/NotFound"

vi.mock("@/components/PlasmaWave", () => ({ PlasmaWave: () => null }))

function render(path: string): HTMLElement {
  const container = document.createElement("div")
  container.innerHTML = renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <NotFound />
    </MemoryRouter>,
  )
  return container
}

describe("NotFound", () => {
  it("shows the status code and the requested path", () => {
    const container = render("/definitely-not-a-page")
    expect(container.textContent).toContain("404")
    expect(container.textContent).toContain("/definitely-not-a-page")
  })

  it("marks the page as noindex", () => {
    const container = render("/nope")
    const robots = container.querySelector('meta[name="robots"]')
    expect(robots?.getAttribute("content")).toContain("noindex")
  })

  it("links back home and to search", () => {
    const container = render("/nope")
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"))
    expect(hrefs).toContain("/")
    expect(hrefs).toContain("/search")
  })
})
