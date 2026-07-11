import useSWR, { type SWRConfiguration } from "swr"
import type { Announcement } from "@/lib/announcements"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const SELECT_FIELDS =
  "id,created_at,updated_at,title,date,body,tag,app,pinned,published"

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
      ? `${SUPABASE_URL}/rest/v1/announcements?select=${SELECT_FIELDS}&published=eq.true&order=date.desc`
      : null

  const { data, error, isLoading } = useSWR<Announcement[]>(url, fetcher, swrConfig)
  return {
    items: data ?? [],
    isLoading,
    error,
    configured: !!url,
  }
}

export function useLatestAnnouncement() {
  const url =
    SUPABASE_URL && PUBLISHABLE_KEY
      ? `${SUPABASE_URL}/rest/v1/announcements?select=${SELECT_FIELDS}&published=eq.true&order=pinned.desc,date.desc&limit=1`
      : null

  const { data, error, isLoading } = useSWR<Announcement[]>(url, fetcher, swrConfig)
  return {
    item: data?.[0] ?? null,
    isLoading,
    error,
    configured: !!url,
  }
}
