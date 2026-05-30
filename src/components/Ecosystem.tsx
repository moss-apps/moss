import { motion } from "framer-motion"
import { ArrowRight, Download } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative py-16 md:py-20 lg:py-32 px-4 md:px-6">
      {/* Dot-grid texture — 2px dots, 16px spacing, 3% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-label mb-4 flex items-center gap-3 justify-center">
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>// 01 — THE_ECOSYSTEM</span>
          </div>
          <h2 className="text-display text-[clamp(2rem,5vw,4rem)] text-[#F5F5F5] w-full text-center">
            One secure backbone.
            <br />
            <span className="text-[#8A8A90]">Two powerful apps.</span>
          </h2>
        </motion.div>

        {/* Matrix grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-2 md:max-w-4xl mx-auto"
        >
          {/* Latch */}
          <motion.div variants={item} className="relative py-12 px-10 text-center md:text-left">
            {/* Vertical divider — desktop */}
            <div
              className="hidden md:block absolute right-0 top-0 bottom-0 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent 100%)",
              }}
            />
            {/* Horizontal divider — mobile */}
            <div
              className="md:hidden absolute left-0 right-0 bottom-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent 100%)",
              }}
            />

            <div className="flex justify-center md:justify-start">
              <img
                src="/assets/logos/latch_logo.svg"
                alt="Latch"
                className="h-6 w-auto mb-6 block max-w-full"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">Latch</h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed mb-6">
              A secure media vault with AES-256 encryption, decoy mode, auto-kill
              triggers, and folder-based organization. Your files stay yours.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a
                href="mailto:moss_apps@proton.me?subject=Latch%20Closed%20Beta%20Access"
                className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:gap-3 transition-all"
              >
                Join Closed Beta <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/moss-apps/Latch/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
              >
                <Download className="w-4 h-4" />
                GitHub Releases
              </a>
            </div>
          </motion.div>

          {/* Flick Player */}
          <motion.div variants={item} className="relative py-12 px-10 text-center md:text-left">
            {/* Horizontal divider — mobile */}
            <div
              className="md:hidden absolute left-0 right-0 bottom-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent 100%)",
              }}
            />

            <div className="flex justify-center md:justify-start">
              <img
                src="/assets/logos/flick_logo.svg"
                alt="Flick Player"
                className="h-6 w-auto mb-6 block max-w-full"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">Flick Player</h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed mb-6">
              An audiophile-grade music player with UAC 2.0 support, lossless
              playback, and a tactile interface designed for focused listening.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a
                href="https://www.flick-player.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:gap-3 transition-all"
              >
                Visit Site <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.mossapps.flick"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
              >
                Google Play
              </a>
              <a
                href="https://github.com/moss-apps/Flick/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
              >
                <Download className="w-4 h-4" />
                GitHub Releases
              </a>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
