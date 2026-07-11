export type AnnouncementTag =
  | "update"
  | "release"
  | "maintenance"
  | "security"
  | "general"

export type AnnouncementApp = "flick" | "latch" | "both" | "ecosystem"

export interface Announcement {
  id: string
  created_at: string
  updated_at: string
  title: string
  date: string
  body: string
  tag: AnnouncementTag
  app: AnnouncementApp
  pinned: boolean
  published: boolean
}

export interface AnnouncementInput {
  title: string
  date: string
  body: string
  tag: AnnouncementTag
  app: AnnouncementApp
  pinned: boolean
  published: boolean
}

export const TAG_META: Record<AnnouncementTag, { label: string; color: string }> = {
  update: { label: "Update", color: "var(--accent)" },
  release: { label: "Release", color: "#22C55E" },
  maintenance: { label: "Maintenance", color: "#F97316" },
  security: { label: "Security", color: "#EF4444" },
  general: { label: "General", color: "#6A6A70" },
}

export const APP_META: Record<AnnouncementApp, { label: string; logo?: string }> = {
  flick: { label: "Flick", logo: "/assets/logos/flick_logo.svg" },
  latch: { label: "Latch", logo: "/assets/logos/latch_logo.svg" },
  both: { label: "Ecosystem" },
  ecosystem: { label: "Ecosystem" },
}

export const TAG_OPTIONS = Object.entries(TAG_META).map(([key, meta]) => ({
  key: key as AnnouncementTag,
  ...meta,
}))

export const APP_OPTIONS = Object.entries(APP_META).map(([key, meta]) => ({
  key: key as AnnouncementApp,
  ...meta,
}))
