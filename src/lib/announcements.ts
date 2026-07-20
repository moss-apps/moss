export type AnnouncementTag =
  | "update"
  | "release"
  | "maintenance"
  | "security"
  | "general"

export type AnnouncementApp = "flick" | "latch" | "both" | "ecosystem"

export type AttachmentKind = "image" | "video" | "file"

export interface Attachment {
  path: string
  url: string
  name: string
  type: string
  size: number
  kind: AttachmentKind
}

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
  attachments: Attachment[]
}

export interface AnnouncementInput {
  id?: string
  title: string
  date: string
  body: string
  tag: AnnouncementTag
  app: AnnouncementApp
  pinned: boolean
  published: boolean
  attachments: Attachment[]
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

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const panelStyle = {
  borderTop: "1px solid transparent",
  borderBottom: "1px solid transparent",
  borderImage:
    "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
} as const

// ponytail: regex strip — known ceiling: raw HTML, nested formatting, and
// GFM tables won't flatten cleanly. Upgrade to an mdast walker if excerpts
// ever need structure-aware truncation.
export function excerpt(body: string, max = 180): string {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[#>\-*+]+\s+/gm, " ")
    .replace(/[*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text
}
