import { motion } from "framer-motion"
import { ArrowRight, Download, ExternalLink } from "lucide-react"
import AcidSquares from "./AcidSquares"
import { useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

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

const features = {
  latch: ["AES-256 encryption", "Decoy mode", "Auto-kill triggers"],
  flick: ["UAC 2.0 DAC output", "Lossless playback", "Tactile interface"],
}

export function Ecosystem() {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)
  const showShader = !isMobile && !performanceMode && !reducedMotion

  return (
    <section
      id="ecosystem"
      className="relative py-16 md:py-20 lg:py-32 px-4 md:px-6 overflow-hidden"
    >
      {/* Dot-grid texture — 2px dots, 16px spacing, 3% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* Radial accent glow */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[600px] max-w-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-display text-[clamp(2rem,5vw,4rem)] text-[#F5F5F5]">
            One secure backbone.
            <br />
            <span className="text-[#8A8A90]">Two powerful apps.</span>
          </h2>
          <p className="mt-5 text-sm text-[#8A8A90] max-w-md mx-auto leading-relaxed">
            Two standalone apps, one shared security core. Move files between
            them without ever leaving an encrypted session.
          </p>
        </motion.div>

        {/* Tiled panel — one square, subdivided; animated shader background */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative brutal-border overflow-hidden md:max-w-4xl mx-auto"
        >
          {showShader && (
            <div className="absolute inset-0 pointer-events-none">
              <AcidSquares
                detail="low"
                opacity={0.45}
                color1="#14B8A6"
                color2="#0EA5E9"
                color3="#5EEAD4"
                speed={0.3}
                mouseInteraction={false}
              />
            </div>
          )}
          {/* Scrim for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/40 via-[#0A0A0B]/50 to-[#0A0A0B]/65 pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 divide-y divide-white/15 md:divide-y-0 md:divide-x">
            {/* Latch tile */}
            <motion.div
              variants={item}
              className="relative p-8 md:p-10 hover:bg-white/[0.05] transition-colors flex flex-col"
            >
              <div className="relative flex flex-col h-full">
                <img
                  src="/assets/logos/latch_logo.svg"
                  alt="Latch"
                  className="h-6 w-auto mb-6 block max-w-full"
                />
                <span className="text-label inline-block mb-4">Secure vault</span>
                <h3 className="font-display text-2xl text-[#F5F5F5] mb-3">
                  Latch
                </h3>
                <p className="text-sm text-[#C5C5CA] leading-relaxed mb-5">
                  A secure media vault. Your files stay encrypted at rest, decoys
                  cover your tracks, and triggers wipe on demand.
                </p>
                <ul className="space-y-2 mb-7">
                  {features.latch.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-[#C5C5CA]"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mossapps.locker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#0A0A0B] bg-[var(--accent)] hover:brightness-110 transition-[filter]"
                  >
                    Google Play <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/moss-apps/Latch/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#F5F5F5] hover:bg-white/10 border border-white/15 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Releases
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Flick tile */}
            <motion.div
              variants={item}
              className="relative p-8 md:p-10 hover:bg-white/[0.05] transition-colors flex flex-col"
            >
              <div className="relative flex flex-col h-full">
                <img
                  src="/assets/logos/flick_logo.svg"
                  alt="Flick"
                  className="h-6 w-auto mb-6 block max-w-full"
                />
                <span className="text-label inline-block mb-4">Music player</span>
                <h3 className="font-display text-2xl text-[#F5F5F5] mb-3">Flick</h3>
                <p className="text-sm text-[#C5C5CA] leading-relaxed mb-5">
                  An audiophile-grade music player built for focused listening.
                  Clean signal path, no clutter, no noise.
                </p>
                <ul className="space-y-2 mb-7">
                  {features.flick.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-[#C5C5CA]"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mossapps.flick"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#0A0A0B] bg-[var(--accent)] hover:brightness-110 transition-[filter]"
                  >
                    Google Play <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.flick-player.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#F5F5F5] hover:bg-white/10 border border-white/15 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Visit site
                  </a>
                  <a
                    href="https://github.com/moss-apps/Flick/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#F5F5F5] hover:bg-white/10 border border-white/15 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Releases
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
