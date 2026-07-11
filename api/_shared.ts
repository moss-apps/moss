import crypto from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { Redis } from "@upstash/redis"
import { z } from "zod"

export interface ApiRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body: Record<string, unknown> | string | undefined
  query: Record<string, string | string[] | undefined>
}

export interface ApiResponse {
  status: (code: number) => ApiResponse
  json: (data: unknown) => ApiResponse
  setHeader: (key: string, value: string | string[]) => ApiResponse
  end: (data?: string) => ApiResponse
}

export const announcementSchema = z.object({
  title: z.string().min(1).max(200),
  date: z.string().min(1),
  body: z.string().max(50000).default(""),
  tag: z.enum(["update", "release", "maintenance", "security", "general"]),
  app: z.enum(["flick", "latch", "both", "ecosystem"]),
  pinned: z.boolean().default(false),
  published: z.boolean().default(false),
})

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export function verifyAuth(req: ApiRequest): boolean {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 16) return false
  const provided = req.headers["authorization"]
  if (typeof provided !== "string" || !provided) return false
  const hashA = crypto.createHash("sha256").update(provided).digest()
  const hashB = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

const redisUrl =
  process.env.MOSS_KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const redisToken =
  process.env.MOSS_KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null

export function getClientIp(req: ApiRequest): string {
  const fwd = req.headers["x-forwarded-for"]
  if (Array.isArray(fwd)) return fwd[0] || "unknown"
  return fwd || "unknown"
}

export async function checkRateLimit(
  ip: string,
): Promise<{ blocked: boolean; retryAfter: number }> {
  if (!redis) return { blocked: false, retryAfter: 0 }

  const lockKey = `ratelimit:lock:admin:${ip}`
  const locked = await redis.get(lockKey)
  if (locked) {
    const ttl = await redis.ttl(lockKey)
    return { blocked: true, retryAfter: ttl > 0 ? ttl : 60 }
  }

  const failKey = `ratelimit:fail:admin:${ip}`
  const fails = await redis.get<number>(failKey)
  if (fails !== null && fails >= 5) {
    const ttl = await redis.ttl(failKey)
    return { blocked: true, retryAfter: ttl > 0 ? ttl : 60 }
  }

  return { blocked: false, retryAfter: 0 }
}

export async function recordFailure(ip: string): Promise<void> {
  if (!redis) return
  const failKey = `ratelimit:fail:admin:${ip}`
  const fails = await redis.incr(failKey)
  if (fails === 1) {
    await redis.expire(failKey, 900)
  }
  if (fails >= 10) {
    const lockKey = `ratelimit:lock:admin:${ip}`
    await redis.set(lockKey, 1, { ex: 1800 })
  }
}

export async function recordSuccess(ip: string): Promise<void> {
  if (!redis) return
  await redis.del(`ratelimit:fail:admin:${ip}`)
}

let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.VITE_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SECRET_KEY
    if (!url || !serviceKey) throw new Error("Missing Supabase env vars")
    _supabaseAdmin = createClient(url, serviceKey, {
      auth: { persistSession: false },
    })
  }
  return _supabaseAdmin
}
