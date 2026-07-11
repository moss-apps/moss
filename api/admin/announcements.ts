import {
  announcementSchema,
  ATTACHMENTS_BUCKET,
  getSupabaseAdmin,
  verifyAuth,
  checkRateLimit,
  recordFailure,
  recordSuccess,
  getClientIp,
  type ApiRequest,
  type ApiResponse,
} from "../_shared.js"

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

  const supabase = getSupabaseAdmin()
  const method = req.method?.toUpperCase()

  try {
    if (method === "GET") {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("date", { ascending: false })

      if (error) throw error
      return res.status(200).json(data)
    }

    if (method === "POST") {
      const parsed = announcementSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues })
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert(parsed.data)
        .select()
        .single()

      if (error) throw error

      await supabase.from("admin_audit").insert({
        action: "create",
        target_id: data.id,
        detail: { fields: Object.keys(parsed.data) },
      })

      return res.status(201).json(data)
    }

    if (method === "PATCH") {
      const id = req.query.id
      if (typeof id !== "string") {
        return res.status(400).json({ error: "Missing id" })
      }

      const parsed = announcementSchema.partial().safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues })
      }

      // id is insert-only; never update the primary key
      const update = { ...parsed.data }
      delete update.id

      const { data, error } = await supabase
        .from("announcements")
        .update(update)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      await supabase.from("admin_audit").insert({
        action: "update",
        target_id: id,
        detail: { fields: Object.keys(update) },
      })

      return res.status(200).json(data)
    }

    if (method === "DELETE") {
      const id = req.query.id
      if (typeof id !== "string") {
        return res.status(400).json({ error: "Missing id" })
      }

      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id)

      if (error) throw error

      // ponytail: best-effort folder wipe; prefix remove handles all attachments
      // for this announcement. Ignore storage errors — row is already gone.
      await supabase.storage.from(ATTACHMENTS_BUCKET).remove([`${id}/`])

      await supabase.from("admin_audit").insert({
        action: "delete",
        target_id: id,
      })

      return res.status(204).end()
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    // ponytail: supabase PostgrestError is a plain object, not Error — surface its message
    const message =
      (err as { message?: string })?.message ??
      (err instanceof Error ? err.message : "Internal server error")
    return res.status(500).json({ error: message })
  }
}
