import type { Announcement, AnnouncementInput } from "@/lib/announcements"

const STORAGE_KEY = "moss_admin_token"

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEY, token)
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

// ponytail: in-memory idle timer, one admin. Fine for single-tab use.
let idleTimer: ReturnType<typeof setInterval> | null = null

export function startIdleWatcher(
  onTimeout: () => void,
  timeoutMs = 15 * 60 * 1000,
): () => void {
  let lastActivity = Date.now()

  const updateActivity = () => {
    lastActivity = Date.now()
  }

  document.addEventListener("mousedown", updateActivity)
  document.addEventListener("keydown", updateActivity)

  idleTimer = setInterval(() => {
    if (Date.now() - lastActivity > timeoutMs) {
      stopIdleWatcher()
      clearAdminToken()
      onTimeout()
    }
  }, 30 * 1000)

  return () => {
    document.removeEventListener("mousedown", updateActivity)
    document.removeEventListener("keydown", updateActivity)
  }
}

export function stopIdleWatcher(): void {
  if (idleTimer) {
    clearInterval(idleTimer)
    idleTimer = null
  }
}

async function adminFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken()
  if (!token) throw new Error("Not authenticated")

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (res.status === 401) {
    clearAdminToken()
    throw new Error("Authentication failed")
  }
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After")
    throw new Error(`Rate limited. Retry after ${retryAfter ?? 60} seconds.`)
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const adminApi = {
  async auth(password: string): Promise<boolean> {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { Authorization: password, "Content-Type": "application/json" },
    })
    if (res.ok) {
      setAdminToken(password)
      return true
    }
    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After")
      throw new Error(`Rate limited. Retry after ${retryAfter ?? 60}s.`)
    }
    return false
  },

  list: (): Promise<Announcement[]> =>
    adminFetch<Announcement[]>("/api/admin/announcements"),

  create: (data: AnnouncementInput): Promise<Announcement> =>
    adminFetch<Announcement>("/api/admin/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<AnnouncementInput>): Promise<Announcement> =>
    adminFetch<Announcement>(
      `/api/admin/announcements?id=${encodeURIComponent(id)}`,
      { method: "PATCH", body: JSON.stringify(data) },
    ),

  remove: (id: string): Promise<void> =>
    adminFetch<void>(
      `/api/admin/announcements?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ),
}
