import { useMemo } from "react"
import { motion } from "framer-motion"
import AcidSquares from "@/components/AcidSquares"
import { HeroCubes } from "@/components/HeroCubes"
import { accentMap, useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

const tint = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16)
  const m = (v: number) =>
    Math.round(v + (255 - v) * amt)
      .toString(16)
      .padStart(2, "0")
  return `#${m((n >> 16) & 255)}${m((n >> 8) & 255)}${m(n & 255)}`
}

export function Hero() {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)
  const accent = useMossStore((s) => s.accent)

  const lowEnd = isMobile || performanceMode
  const accentHex = accentMap[accent].hex
  const colors = useMemo(
    () => [accentHex, tint(accentHex, 0.3), tint(accentHex, 0.6)],
    [accentHex]
  )

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden px-4 sm:px-6 lg:px-10 pt-20 pb-8 md:pb-10">
      {reducedMotion ? null : (
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <AcidSquares
            detail={lowEnd ? "low" : "medium"}
            speed={lowEnd ? 0.12 : 0.22}
            opacity={lowEnd ? 0.16 : 0.28}
            mouseInteraction={!isMobile}
            color1={colors[0]}
            color2={colors[1]}
            color3={colors[2]}
          />
        </div>
      )}
      {/* Bottom fade so the ferrofluid dissolves into the page instead of cutting */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 -z-0 pointer-events-none bg-gradient-to-t from-canvas to-transparent" />

      {/* Center: the mark is the hero object */}
      <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 py-2 md:py-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <HeroCubes className="h-[min(clamp(280px,62vw,560px),48vh)] aspect-square md:h-[min(clamp(460px,74vw,920px),60vh,calc(100dvh_-_350px))]" />
        </motion.div>
      </div>

      {/* Corners: wordmark flush left, creed + CTAs flush right */}
      <div className="relative z-10 flex flex-col gap-10 sm:gap-8 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          <p className="text-label mb-3 sm:mb-4 flex items-center gap-3">
            <span className="w-6 h-px bg-[var(--accent)]" />
            All free / 2 apps / Open source
          </p>
          <h1 className="text-display text-ink text-[clamp(4.5rem,13vw,11rem)]">
            Moss
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
          className="glass w-full sm:w-[22rem] md:w-[24rem] shrink-0 p-5 md:p-6"
        >
          <span className="mb-5 block h-px w-10 bg-[var(--accent)]" />
          <p className="text-[15px] md:text-base leading-relaxed text-ink">
            An ecosystem of secure, interconnected creative tools.
          </p>
          <p className="text-label mt-3">
            Built open-source. No ads. No compromise.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5">
            <a
              href="https://play.google.com/store/apps/details?id=com.mossapps.flick"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-md bg-[var(--accent)] text-canvas font-medium text-sm hover:brightness-110 active:brightness-95 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Get Flick
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.mossapps.locker"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-md border border-glass-border text-ink font-medium text-sm hover:bg-glass-hover active:bg-white/10 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Get Latch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
