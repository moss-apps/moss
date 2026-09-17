import { redis, type ApiRequest, type ApiResponse } from "./_shared.js"

const REPOS = {
  Latch: "moss-apps/Latch",
  Flick: "moss-apps/Flick",
} as const

const CACHE_TTL_SECONDS = 30 * 60
const CACHE_HEADER = "public, max-age=300, s-maxage=1800"

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const repo = typeof req.query.repo === "string" ? req.query.repo : ""
  const slug = REPOS[repo as keyof typeof REPOS]
  if (!slug) return res.status(400).json({ error: "Unknown repo" })

  const latest = req.query.latest === "1"
  const cacheKey = `github:releases:${latest ? "latest" : "list"}:${repo}`

  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      res.setHeader("cache-control", CACHE_HEADER)
      return res.status(200).json(cached)
    }
  }

  const path = latest
    ? `/repos/${slug}/releases/latest`
    : `/repos/${slug}/releases?per_page=100`
  const token = process.env.GITHUB_TOKEN

  const ghRes = await fetch(`https://api.github.com${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "moss-site",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!ghRes.ok) {
    return res.status(502).json({ error: `GitHub request failed (${ghRes.status})` })
  }

  const data = await ghRes.json()
  if (redis) await redis.set(cacheKey, data, { ex: CACHE_TTL_SECONDS })
  res.setHeader("cache-control", CACHE_HEADER)
  return res.status(200).json(data)
}
