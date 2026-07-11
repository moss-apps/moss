import {
  verifyAuth,
  checkRateLimit,
  recordFailure,
  recordSuccess,
  getClientIp,
  type ApiRequest,
  type ApiResponse,
} from "../_shared.js"

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method?.toUpperCase() !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const ip = getClientIp(req)

  const { blocked, retryAfter } = await checkRateLimit(ip)
  if (blocked) {
    res.setHeader("Retry-After", String(retryAfter))
    return res.status(429).json({ error: "Too many attempts. Try again later." })
  }

  if (!verifyAuth(req)) {
    await recordFailure(ip)
    return res.status(401).json({ error: "Invalid password" })
  }

  await recordSuccess(ip)
  return res.status(200).json({ ok: true })
}
