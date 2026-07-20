import { Link, useParams } from "react-router"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Calendar,
  Pin,
  Megaphone,
} from "lucide-react"
import { useAnnouncement } from "@/hooks/useAnnouncements"
import {
  TAG_META,
  APP_META,
  formatDate,
  panelStyle,
  type Announcement,
} from "@/lib/announcements"
import { AnnouncementAttachments } from "@/pages/Announcements"

function AnnouncementBody({ item }: { item: Announcement }) {
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

      <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F5F5] mb-6">
        {item.title}
      </h1>

      {item.body && (
        <div className="changelog-prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {item.body}
          </ReactMarkdown>
        </div>
      )}

      <AnnouncementAttachments items={item.attachments ?? []} />
    </motion.article>
  )
}

export function AnnouncementDetail() {
  const params = useParams<{ id?: string }>()
  const { item, isLoading, error, configured } = useAnnouncement(params.id)

  return (
    <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen">
      <title>
        {item ? `${item.title} — Moss Laboratories` : "Announcement — Moss Laboratories"}
      </title>
      <meta
        name="description"
        content={
          item
            ? item.body.slice(0, 160).replace(/\s+/g, " ").trim()
            : "An announcement from the Moss ecosystem."
        }
      />
      <div className="max-w-3xl mx-auto">
        <Link
          to="/announcements"
          className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All announcements
        </Link>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            <p className="text-sm text-[#8A8A90]">Loading announcement…</p>
          </div>
        )}

        {!isLoading && (error || (!item && configured)) && (
          <div className="p-8 text-center" style={panelStyle}>
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            {error ? (
              <>
                <h2 className="font-display text-xl text-[#F5F5F5] mb-2">
                  Couldn&apos;t load announcement
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
              </>
            ) : (
              <>
                <h2 className="font-display text-xl text-[#F5F5F5] mb-2">
                  Announcement not found
                </h2>
                <p className="text-sm text-[#8A8A90] max-w-md mx-auto mb-6">
                  This announcement may have been removed or is no longer
                  published.
                </p>
                <Link
                  to="/announcements"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-all"
                  style={{
                    border: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06) 100%) 1",
                  }}
                >
                  <Megaphone className="w-4 h-4" />
                  Browse announcements
                </Link>
              </>
            )}
          </div>
        )}

        {!isLoading && !configured && (
          <div className="p-8 text-center" style={panelStyle}>
            <p className="text-[#8A8A90]">Announcements are not configured.</p>
          </div>
        )}

        {!isLoading && !error && item && (
          <AnnouncementBody item={item} />
        )}
      </div>
    </main>
  )
}