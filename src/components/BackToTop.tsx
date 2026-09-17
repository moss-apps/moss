import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useMossStore } from "@/stores/useMossStore"

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const reducedMotion = useMossStore((s) => s.reducedMotion)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 600)
        ticking = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={() =>
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: reducedMotion ? "auto" : "smooth",
            })
          }
          aria-label="Back to top"
          title="Back to top"
          className="fixed right-4 sm:right-6 z-40 p-2.5 rounded-full nav-glass border text-[#8A8A90] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-colors"
          style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
