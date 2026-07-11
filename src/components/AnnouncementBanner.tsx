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
          style={{ backgroundColor: "var(--accent)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 border-b border-black/10">
            <Megaphone className="w-4 h-4 text-[#0A0A0B] shrink-0" />
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider shrink-0 text-[#0A0A0B]/70">
                {TAG_META[item.tag].label}
              </span>
              <span className="text-sm text-[#0A0A0B] truncate font-medium">
                {item.title}
              </span>
              <Link
                to="/announcements"
                className="hidden sm:inline-flex shrink-0 items-center text-xs text-[#0A0A0B] hover:underline ml-auto font-medium"
              >
                Read more
              </Link>
            </div>
            <Link
              to="/announcements"
              className="sm:hidden shrink-0 text-xs text-[#0A0A0B] font-medium"
            >
              →
            </Link>
            <button
              onClick={() => setDismissedId(item.id)}
              className="shrink-0 p-1 text-[#0A0A0B]/70 hover:text-[#0A0A0B] transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
