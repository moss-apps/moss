import { Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { X, Megaphone } from "lucide-react"
import { useLatestAnnouncement } from "@/hooks/useAnnouncements"
import { TAG_META } from "@/lib/announcements"
import { useMossStore } from "@/stores/useMossStore"

export function AnnouncementBanner() {
  const { item, configured } = useLatestAnnouncement()
  const dismissedId = useMossStore((s) => s.dismissedAnnouncementId)
  const setDismissedId = useMossStore((s) => s.setDismissedAnnouncementId)

  const visible = configured && item && item.id !== dismissedId

  return (
    <AnimatePresence>
      {visible && item && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div
            className="relative px-4 sm:px-6"
            style={{
              borderBottom: "1px solid transparent",
              borderImage:
                "linear-gradient(to right, transparent 0%, var(--accent)40 20%, var(--accent)40 80%, transparent 100%) 1",
            }}
          >
            <div className="max-w-7xl mx-auto py-2.5 flex items-center gap-3">
              <Megaphone className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span
                  className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider shrink-0"
                  style={{ color: TAG_META[item.tag].color }}
                >
                  {TAG_META[item.tag].label}
                </span>
                <span className="text-sm text-[#F5F5F5] truncate font-medium">
                  {item.title}
                </span>
                <Link
                  to="/announcements"
                  className="hidden sm:inline-flex shrink-0 items-center text-xs text-[var(--accent)] hover:underline ml-auto"
                >
                  Read more
                </Link>
              </div>
              <Link
                to="/announcements"
                className="sm:hidden shrink-0 text-xs text-[var(--accent)]"
              >
                →
              </Link>
              <button
                onClick={() => setDismissedId(item.id)}
                className="shrink-0 p-1 text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
