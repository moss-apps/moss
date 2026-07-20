import { Link } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Megaphone,
  AlertCircle,
  Loader2,
  Calendar,
  Pin,
  FileText,
} from "lucide-react"
import { useAnnouncements } from "@/hooks/useAnnouncements"
import {
  TAG_META,
  APP_META,
  excerpt,
  formatDate,
  panelStyle,
  type Announcement,
  type Attachment,
} from "@/lib/announcements"

export function AnnouncementAttachments({ items }: { items: Attachment[] }) {
  if (!items || items.length === 0) return null
  const images = items.filter((a) => a.kind === "image")
  const videos = items.filter((a) => a.kind === "video")
  const files = items.filter((a) => a.kind === "file")
  return (
    <div className="mt-4 space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((a) => (
            <a
              key={a.path}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={a.url}
                alt={a.name}
                className="w-full aspect-video object-cover border border-white/5"
              />
            </a>
          ))}
        </div>
      )}
      {videos.map((a) => (
        <video
          key={a.path}
          src={a.url}
          controls
          className="w-full border border-white/5"
        />
      ))}
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {files.map((a) => (
            <li key={a.path}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8A8A90] hover:text-[#F5F5F5] border border-white/10 hover:border-white/20 transition-colors"
              >
                <FileText className="w-3 h-3" />
                {a.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function AnnouncementCard({ item }: { item: Announcement }) {
  const tagMeta = TAG_META[item.tag]
  const appMeta = APP_META[item.app]

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative py-6 sm:py-8 px-0 sm:px-8"
      style={{
        ...panelStyle,
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <span
          className="px-2.5 py-1 font-mono text-xs"
          style={{ color: tagMeta.color }}
        >
          {tagMeta.label}
        </span>
        {item.pinned && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
            <Pin className="w-3 h-3" />
            Pinned
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs text-[#8A8A90]">
          <Calendar className="w-3 h-3" />
          {formatDate(item.date)}
        </span>
        {appMeta.logo && (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#8A8A90]">
            <img src={appMeta.logo} alt="" className="w-3.5 h-3.5" />
            {appMeta.label}
          </span>
        )}
      </div>

      <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-[#F5F5F5] mb-4">
        <Link
          to={`/announcements/${item.id}`}
          className="hover:text-[var(--accent)] transition-colors"
        >
          {item.title}
        </Link>
      </h2>

      {item.body && (
        <p className="text-sm text-[#8A8A90] leading-relaxed line-clamp-3">
          {excerpt(item.body)}
        </p>
      )}

      <div className="mt-4">
        <Link
          to={`/announcements/${item.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline transition-colors"
        >
          Read more
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <AnnouncementAttachments items={item.attachments ?? []} />
    </motion.article>
  )
}

export function Announcements() {
  const { items, isLoading, error, configured } = useAnnouncements()

  return (
    <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen">
      <title>Announcements — Moss Laboratories</title>
      <meta
        name="description"
        content="Latest announcements and updates from the Moss ecosystem."
      />
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moss
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Megaphone className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#F5F5F5]">
              Announcements
            </h1>
          </div>
          <p className="text-[#8A8A90] max-w-xl leading-relaxed">
            News, updates, and notices from across the Moss ecosystem.
          </p>
        </div>

        {!configured && !isLoading && (
          <div className="p-8 text-center" style={panelStyle}>
            <p className="text-[#8A8A90]">Announcements are not configured.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            <p className="text-sm text-[#8A8A90]">Loading announcements…</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="p-8 text-center" style={panelStyle}>
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-xl text-[#F5F5F5] mb-2">
              Couldn&apos;t load announcements
            </h2>
            <p className="text-sm text-[#8A8A90] max-w-md mx-auto mb-6">
              The announcement service may be temporarily unavailable. Try
              again in a moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-all"
              style={{
                border: "1px solid transparent",
                borderImage:
                  "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06) 100%) 1",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && configured && items.length === 0 && (
          <div className="p-8 text-center" style={panelStyle}>
            <p className="text-[#8A8A90]">No announcements yet.</p>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-6">
            {items.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
