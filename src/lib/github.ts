export type GitHubRepo = "Latch" | "Flick"

export const releasesUrl = (repo: GitHubRepo) => `/api/releases?repo=${repo}`

export const latestReleaseUrl = (repo: GitHubRepo) => `/api/releases?repo=${repo}&latest=1`

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json() as Promise<T>
}
