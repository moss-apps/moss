import { Link, useLocation } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, CornerDownLeft, Search } from "lucide-react"
import { PlasmaWave } from "@/components/PlasmaWave"

const SUGGESTED_LINKS = [
  { label: "Ecosystem", href: "/#ecosystem" },
  { label: "Flick", href: "/flick" },
  { label: "Latch", href: "/latch" },
  { label: "Downloads", href: "/downloads" },
  { label: "Changelog", href: "/changelog" },
  { label: "Announcements", href: "/announcements" },
]

export function NotFound() {
  const { pathname } = useLocation()

  return (
    <main className="relative min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 bg-[#0A0A0B] flex flex-col">
      <title>404 — Page Not Found — Moss Laboratories</title>
      <meta
        name="description"
        content="The page you requested does not exist on the Moss Laboratories website."
      />
      <meta name="robots" content="noindex, nofollow" />

      <PlasmaWave />

      <div className="relative z-10 w-full max-w-3xl mx-auto my-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-center"
        >
          {/* Request readout */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 mb-8 font-mono text-xs border border-white/10 bg-white/[0.02] max-w-full">
            <span className="uppercase tracking-wider text-[#6A6A70]">GET</span>
            <span className="text-[#F5F5F5] truncate max-w-[40vw] sm:max-w-xs">
              {pathname}
            </span>
            <span className="text-red-400 font-medium">404</span>
          </div>

          <p className="text-label mb-4">Status 404 · Not Found</p>
          <h1
            className="font-display font-medium tracking-tighter leading-none text-[#F5F5F5] mb-6 select-none"
            style={{ fontSize: "clamp(5rem, 22vw, 11rem)" }}
          >
            4
            <span className="text-[var(--accent)]">0</span>
            4
          </h1>
          <p className="text-[#8A8A90] max-w-md mx-auto leading-relaxed mb-10">
            This endpoint doesn&apos;t exist — the link may be broken, or the
            page was moved. The rest of the ecosystem is still here.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md bg-[var(--accent)] text-[#0A0A0B] hover:brightness-110 transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-white/15 text-[#F5F5F5] hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <Search className="w-4 h-4" />
              Search the site
            </Link>
          </div>

          {/* Suggested routes */}
          <div
            className="pt-8 mx-auto max-w-xl"
            style={{
              borderTop: "1px solid transparent",
              borderImage:
                "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent 100%) 1",
            }}
          >
            <p className="text-label mb-4">Try one of these</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {SUGGESTED_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#8A8A90] hover:text-[var(--accent)] transition-colors"
                  >
                    <CornerDownLeft className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
