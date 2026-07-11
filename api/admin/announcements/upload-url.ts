import crypto from "node:crypto"
import { z } from "zod"
import {
  ATTACHMENTS_BUCKET,
  MAX_ATTACHMENT_SIZE,
  kindFromMime,
  getSupabaseAdmin,
  verifyAuth,
  checkRateLimit,
  recordFailure,
  recordSuccess,
  getClientIp,
  type ApiRequest,
  type ApiResponse,
} from "../../_shared.js"

const bodySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(100),
  size: z.number().int().nonnegative(),
})

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const ip = getClientIp(req)

  const { blocked, retryAfter } = await checkRateLimit(ip)
  if (blocked) {
    res.setHeader("Retry-After", String(retryAfter))
    return res.status(429).json({ error: "Too many attempts. Try again later." })
  }

  if (!verifyAuth(req)) {
    await recordFailure(ip)
    return res.status(401).json({ error: "Unauthorized" })
  }

  await recordSuccess(ip)

  if (req.method?.toUpperCase() !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues })
  }
  const { id, name, type, size } = parsed.data

  if (size > MAX_ATTACHMENT_SIZE) {
    return res
      .status(413)
      .json({ error: `File exceeds ${MAX_ATTACHMENT_SIZE} byte limit` })
  }

  const kind = kindFromMime(type)
  const ext = name.includes(".")
    ? "." + name.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "")
    : ""
  const path = `${id}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`

  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase.storage
      .from(ATTACHMENTS_BUCKET)
      .createSignedUploadUrl(path)

    if (error || !data) throw error ?? new Error("No signed URL returned")

    const publicUrl = supabase.storage
      .from(ATTACHMENTS_BUCKET)
      .getPublicUrl(path, { download: kind === "file" ? true : undefined })
      .data.publicUrl

    return res.status(200).json({
      path: data.path,
      signedUrl: data.signedUrl,
      publicUrl,
      kind,
      name,
      type,
      size,
    })
  } catch (err) {
    const message =
      (err as { message?: string })?.message ??
      (err instanceof Error ? err.message : "Internal server error")
    return res.status(500).json({ error: message })
  }
}
