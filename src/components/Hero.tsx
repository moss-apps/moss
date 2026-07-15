import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Ferrofluid from "@/components/Ferrofluid"
import { useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

export function Hero() {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)

  const lowEnd = isMobile || performanceMode

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {reducedMotion ? null : (
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <Ferrofluid
            dpr={lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)}
            antialias={!lowEnd}
            frameSkip={lowEnd ? 2 : 1}
            speed={lowEnd ? 0.12 : 0.22}
            opacity={lowEnd ? 0.16 : 0.28}
            mouseInteraction={!isMobile}
            colors={["#9ca3af", "#d1d5db", "#e5e7eb"]}
          />
        </div>
      )}
      {/* Full-bleed centered content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 -ml-2 sm:-ml-3 md:-ml-6"
        >
          <img
            src="/assets/moss_logo.svg"
            alt="Moss"
            className="w-16 h-16 md:w-20 md:h-20 opacity-90"
          />
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex items-center gap-3 text-sm font-sans font-medium text-[#8A8A90]"
        >
          <span className="w-6 h-px bg-[var(--accent)]" />
          <span>Moss Laboratories</span>
          <span className="w-6 h-px bg-[var(--accent)]" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-display text-[clamp(4rem,14vw,12rem)] bg-gradient-to-t from-[#909090] to-[#F5F5F5] bg-clip-text text-transparent leading-[0.9] tracking-[-0.04em]"
        >
          Moss
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 text-lg md:text-xl text-[#8A8A90] max-w-lg leading-relaxed"
        >
          An ecosystem of secure, interconnected creative tools.{" "}
          <br className="hidden md:block" />
          Built open-source. No ads. No compromise.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="https://play.google.com/store/apps/details?id=com.mossapps.flick"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-7 py-3 bg-[var(--accent)] text-[#0A0A0B] font-medium text-sm rounded-md hover:brightness-110 transition-all"
          >
            Get Flick
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.mossapps.locker"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-7 py-3 border border-white/15 text-[#F5F5F5] font-medium text-sm rounded-md hover:bg-white/5 transition-all"
          >
            Get Latch
          </a>
        </motion.div>

        {/* Meta line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="mt-12 flex items-center gap-4 sm:gap-6 text-sm font-sans font-medium text-[#8A8A90]"
        >
          <span>All Free</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>2 Apps</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Open Source</span>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#spine"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
      >
        <span className="text-sm font-sans font-medium text-[#8A8A90]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </section>
  )
}
