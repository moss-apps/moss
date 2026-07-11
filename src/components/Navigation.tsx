import { useState } from "react"
import { Link, useLocation } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { useMossStore, type AccentColor } from "@/stores/useMossStore"
import { Menu, X, Zap, Gauge } from "lucide-react"

const accentOptions: { key: AccentColor; label: string }[] = [
  { key: "teal", label: "Teal" },
  { key: "blue", label: "Blue" },
  { key: "purple", label: "Purple" },
  { key: "pink", label: "Pink" },
  { key: "red", label: "Red" },
  { key: "orange", label: "Orange" },
  { key: "green", label: "Green" },
  { key: "gunmetal", label: "Gunmetal" },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [showAccentPicker, setShowAccentPicker] = useState(false)
  const accent = useMossStore((s) => s.accent)
  const setAccent = useMossStore((s) => s.setAccent)
  const performanceMode = useMossStore((s) => s.performanceMode)
  const setPerformanceMode = useMossStore((s) => s.setPerformanceMode)

  const location = useLocation()
  const isHome = location.pathname === "/"

  const navLinks = [
    { label: "Ecosystem", href: "/#ecosystem" },
    { label: "Latch", href: "/#latch" },
    { label: "Flick", href: "/#flick" },
    { label: "Integration", href: "/#integration" },
    { label: "Ethos", href: "/#ethos" },
    { label: "Announcements", href: "/announcements", isRoute: true },
    { label: "Changelog", href: "/changelog", isRoute: true },
    { label: "Downloads", href: "/downloads", isRoute: true },
  ]

  return (
    <nav className="relative w-full nav-glass border-b" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3 sm:gap-4 md:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/assets/moss_logo.svg"
            alt=""
            className="w-7 h-7 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display font-medium text-sm tracking-tight text-[#F5F5F5]">
            Moss
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.isRoute
              ? location.pathname === link.href
              : isHome && location.hash === link.href.replace("/", "")
            const baseClasses =
              "px-3 py-1.5 text-sm transition-colors rounded-md hover:bg-white/5"
            const activeClasses = isActive
              ? "text-[var(--accent)] bg-[var(--accent)]/10"
              : "text-[#8A8A90] hover:text-[#F5F5F5]"
            return link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className={`${baseClasses} ${activeClasses}`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`${baseClasses} ${activeClasses}`}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
          {/* Performance toggle */}
          <button
            onClick={() => setPerformanceMode(!performanceMode)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border transition-all ${
              performanceMode
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                : "border-white/10 text-[#8A8A90] hover:text-[#F5F5F5] hover:border-white/20"
            }`}
            title="Toggle performance mode"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span className="font-mono uppercase tracking-wider">Perf</span>
          </button>

          {/* Accent picker */}
          <div className="relative">
            <button
              onClick={() => setShowAccentPicker(!showAccentPicker)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-white/10 text-[#8A8A90] hover:text-[#F5F5F5] hover:border-white/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" style={{ color: `var(--accent)` }} />
              <span className="font-mono uppercase tracking-wider">Theme</span>
            </button>
            <AnimatePresence>
              {showAccentPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 glass rounded-2xl p-2 min-w-[140px]"
                >
                  {accentOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setAccent(opt.key)
                        setShowAccentPicker(false)
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-full transition-colors ${
                        accent === opt.key
                          ? "bg-white/10 text-[#F5F5F5]"
                          : "text-[#8A8A90] hover:text-[#F5F5F5] hover:bg-white/5"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            opt.key === "teal"
                              ? "#14B8A6"
                              : opt.key === "blue"
                              ? "#4F8CFF"
                              : opt.key === "purple"
                              ? "#A855F7"
                              : opt.key === "pink"
                              ? "#EC4899"
                              : opt.key === "red"
                              ? "#EF4444"
                              : opt.key === "orange"
                              ? "#F97316"
                              : opt.key === "green"
                              ? "#22C55E"
                              : "#6B7280",
                        }}
                      />
                      <span className="font-mono uppercase tracking-wider">{opt.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-1 text-[#8A8A90] hover:text-[#F5F5F5]"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="md:hidden absolute top-full left-4 right-4 mt-2 nav-glass rounded-2xl overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = link.isRoute
                  ? location.pathname === link.href
                  : isHome && location.hash === link.href.replace("/", "")
                const classes = `block px-3 py-2 text-sm rounded-md hover:bg-white/5 ${
                  isActive
                    ? "text-[var(--accent)] bg-[var(--accent)]/10"
                    : "text-[#8A8A90] hover:text-[#F5F5F5]"
                }`
                return link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={classes}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={classes}
                  >
                    {link.label}
                  </a>
                )
              })}
              <div className="pt-3 flex flex-col gap-3">
                <button
                  onClick={() => setPerformanceMode(!performanceMode)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-md border transition-all ${
                    performanceMode
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-white/10 text-[#8A8A90]"
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span className="font-mono uppercase">Perf</span>
                </button>
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <Zap className="w-3.5 h-3.5" style={{ color: `var(--accent)` }} />
                  <span className="font-mono uppercase text-xs text-[#8A8A90] tracking-wider mr-2">Theme</span>
                  {accentOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setAccent(opt.key)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        accent === opt.key
                          ? "border-white/50 scale-110"
                          : "border-transparent hover:border-white/20"
                      }`}
                      style={{
                        backgroundColor:
                          opt.key === "teal"
                            ? "#14B8A6"
                            : opt.key === "blue"
                            ? "#4F8CFF"
                            : opt.key === "purple"
                            ? "#A855F7"
                            : opt.key === "pink"
                            ? "#EC4899"
                            : opt.key === "red"
                            ? "#EF4444"
                            : opt.key === "orange"
                            ? "#F97316"
                            : opt.key === "green"
                            ? "#22C55E"
                            : "#6B7280",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
