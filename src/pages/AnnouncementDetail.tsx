import { useEffect, useState } from "react"
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
import { PlasmaWave } from "@/components/PlasmaWave"
import { useAnnouncement, useAnnouncements } from "@/hooks/useAnnouncements"
import {
  TAG_META,
  APP_META,
  formatDate,
  panelStyle,
  type Announcement,
} from "@/lib/announcements"
import { AnnouncementAttachments } from "@/pages/Announcements"

function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight
        setP(max > 0 ? window.scrollY / max : 0)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none">
      <div
        className="h-full w-full origin-left will-change-transform"
        style={{ transform: `scaleX(${p})`, background: "var(--accent)" }}
      />
    </div>
  )
}

function AnnouncementTOC({
  items,
  currentId,
}: {
  items: Announcement[]
  currentId?: string
}) {
  return (
    <nav className="space-y-1">
      <p className="text-label mb-3">Announcements</p>
      {items.map((item) => {
        const active = item.id === currentId
        return (
          <Link
            key={item.id}
            to={`/announcements/${item.id}`}
            className={`block py-2 px-3 text-sm transition-colors border-l ${
              active
                ? "border-[var(--accent)] text-[#F5F5F5] bg-white/[0.04]"
                : "border-white/10 text-[#8A8A90] hover:text-[#F5F5F5] hover:border-white/25"
            }`}
          >
            <span className="line-clamp-2 leading-snug">{item.title}</span>
            <span className="block text-[11px] mt-1 font-mono opacity-70">
              {formatDate(item.date)}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function AnnouncementHeader({ item }: { item: Announcement }) {
  const tagMeta = TAG_META[item.tag]
  const appMeta = APP_META[item.app]
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/announcements"
        className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All announcements
      </Link>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#F5F5F5] mb-5 leading-[1.05]"
      >
        {item.title}
      </motion.h1>
      <div className="flex items-center gap-3 flex-wrap">
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
    </div>
  )
}

function AnnouncementBody({ item }: { item: Announcement }) {
  const images = item.attachments?.filter((a) => a.kind === "image") ?? []
  const heroImage = images[0]
  const rest = item.attachments?.filter((a) => a !== heroImage) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hero picture — same width as the text body */}
      {heroImage && (
        <img
          src={heroImage.url}
          alt={heroImage.name}
          loading="lazy"
          className="w-full h-auto border border-white/10 rounded-xl mb-8"
        />
      )}

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

      <AnnouncementAttachments items={rest} />
    </motion.div>
  )
}

export function AnnouncementDetail() {
  const params = useParams<{ id?: string }>()
  const { item, isLoading, error, configured } = useAnnouncement(params.id)
  const { items } = useAnnouncements()

  return (
    <main className="relative min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 bg-[#0A0A0B]">
      <ScrollProgress />
      <title>
        {item
          ? `${item.title} — Moss Laboratories`
          : "Announcement — Moss Laboratories"}
      </title>
      <meta
        name="description"
        content={
          item
            ? item.body.slice(0, 160).replace(/\s+/g, " ").trim()
            : "An announcement from the Moss ecosystem."
        }
      />

      {/* Plasma wave — upper part of the background, fading into #0A0A0B */}
      <PlasmaWave />

      <div className="relative z-10 mx-auto max-w-5xl">
        {isLoading && (
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            <p className="text-sm text-[#8A8A90]">Loading announcement…</p>
          </div>
        )}

        {!isLoading && (error || (!item && configured)) && (
          <div className="max-w-3xl mx-auto p-8 text-center" style={panelStyle}>
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
                      "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06)) 100%) 1",
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
                      "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06)) 100%) 1",
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
          <div className="max-w-3xl mx-auto p-8 text-center" style={panelStyle}>
            <p className="text-[#8A8A90]">Announcements are not configured.</p>
          </div>
        )}

        {!isLoading && !error && item && (
          <>
            <AnnouncementHeader item={item} />
            {/* Reading area — lowered; TOC top aligns with the picture */}
            <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 mt-16">
              <aside className="hidden lg:block">
                <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto custom-scrollbar pr-1">
                  <AnnouncementTOC items={items} currentId={params.id} />
                </div>
              </aside>
              <div className="min-w-0">
                <AnnouncementBody item={item} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
