import useSWR, { type SWRConfiguration } from "swr"
import type { Announcement } from "@/lib/announcements"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const SELECT_FIELDS =
  "id,created_at,updated_at,title,date,body,tag,app,pinned,published,attachments"

const ANNOUNCEMENTS_PATH = "/rest/v1/announcements"

export function announcementReadUrl(
  baseUrl: string,
  id: string | "all" | "latest",
): string {
  const params = new URLSearchParams({
    select: SELECT_FIELDS,
    published: "eq.true",
  })
  if (id === "all") {
    params.set("order", "date.desc")
  } else if (id === "latest") {
    params.set("order", "pinned.desc,date.desc")
    params.set("limit", "1")
  } else {
    return `${baseUrl}${ANNOUNCEMENTS_PATH}?${params.toString()}&id=eq.${encodeURIComponent(id)}`
  }
  return `${baseUrl}${ANNOUNCEMENTS_PATH}?${params.toString()}`
}

const swrConfig: SWRConfiguration = {
  refreshInterval: 30 * 60 * 1000,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 60 * 1000,
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      apikey: PUBLISHABLE_KEY!,
      Authorization: `Bearer ${PUBLISHABLE_KEY}`,
    },
  }).then((res) => res.json())

export function useAnnouncements() {
  const url =
    SUPABASE_URL && PUBLISHABLE_KEY
      ? announcementReadUrl(SUPABASE_URL, "all")
      : null

  const { data, error, isLoading } = useSWR<Announcement[]>(url, fetcher, swrConfig)
  return {
    items: data ?? [],
    isLoading,
    error,
    configured: !!url,
  }
}

export function useAnnouncement(id: string | undefined) {
  const url =
    SUPABASE_URL && PUBLISHABLE_KEY && id
      ? announcementReadUrl(SUPABASE_URL, id)
      : null

  const { data, error, isLoading } = useSWR<Announcement[]>(url, fetcher, swrConfig)
  return {
    item: data?.[0] ?? null,
    isLoading,
    error,
    configured: !!url,
  }
}

export function useLatestAnnouncement() {
  const url =
    SUPABASE_URL && PUBLISHABLE_KEY
      ? announcementReadUrl(SUPABASE_URL, "latest")
      : null

  const { data, error, isLoading } = useSWR<Announcement[]>(url, fetcher, swrConfig)
  return {
    item: data?.[0] ?? null,
    isLoading,
    error,
    configured: !!url,
  }
}
