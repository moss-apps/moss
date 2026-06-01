import { motion } from "framer-motion"
import { Play, Lock, Zap, Fingerprint, Cpu, Check, Link } from "lucide-react"

export function BrokenGridIntegration() {
  return (
    <section id="integration" className="relative py-16 md:py-20 lg:py-32 overflow-hidden">
      {/* Section label — offset left, brutalist */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-16 lg:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 flex items-center justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{
                background:
                  "linear-gradient(var(--color-canvas-raised), var(--color-canvas-raised)) padding-box, linear-gradient(to right, var(--accent), hsl(var(--accent-hue) 80% 16%)) border-box",
                border: "1px solid transparent",
              }}
            >
              <Link className="w-3 h-3 text-[var(--accent)]" />
              <span className="text-sm font-sans font-medium text-[#8A8A90]">Cross App Integration</span>
            </div>
          </div>
          <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-[#F5F5F5] w-full text-center">
            Seamless handoff.
            <span className="text-[#8A8A90]"> Zero friction.</span>
          </h2>
        </motion.div>
      </div>

      {/* Moment 1: Latch → Flick handoff flow */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-16 md:mb-24 lg:mb-28">
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 flex items-center justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{
                background:
                  "linear-gradient(var(--color-canvas-raised), var(--color-canvas-raised)) padding-box, linear-gradient(to right, var(--accent), hsl(var(--accent-hue) 80% 16%)) border-box",
                border: "1px solid transparent",
              }}
            >
              <Lock className="w-3 h-3 text-[var(--accent)]" />
              <span className="text-sm font-sans font-medium text-[#8A8A90]">Step 01 — Select</span>
            </div>
          </div>
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F5F5F5] mb-3">
            Choose media in Latch
          </h3>
          <p className="text-sm text-[#8A8A90] leading-relaxed">
            Browse your encrypted vault. Tap any audio file. The handoff protocol 
            prepares a secure in-memory buffer — the file never touches unencrypted disk.
          </p>
        </motion.div>

        {/* Image block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="relative rounded-2xl overflow-hidden brutal-border aspect-[16/10]">
            <img
              src="/assets/latch_banner.png"
              alt="Latch interface"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/80 via-transparent to-transparent" />

            {/* Floating glass badge */}
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 glass rounded-xl px-3 py-2.5 md:px-4 md:py-3">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--accent)]" />
                <span className="text-[10px] md:text-xs font-sans font-medium text-[#F5F5F5] uppercase tracking-wider">Encrypted</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description grid — ecosystem/ethos divider style */}
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative py-10 px-8 md:px-10 text-center"
          >
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

            <div className="flex justify-center">
              <Fingerprint
                size={24}
                strokeWidth={1.5}
                className="text-[var(--accent)] mb-6"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
              Biometric unlock
            </h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              Face or fingerprint required
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative py-10 px-8 md:px-10 text-center"
          >
            {/* No right divider — last column */}
            {/* No bottom divider — last row */}

            <div className="flex justify-center">
              <Cpu
                size={24}
                strokeWidth={1.5}
                className="text-[var(--accent)] mb-6"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
              Memory-only decode
            </h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              Zero temp file writes
            </p>
          </motion.div>
        </div>
      </div>

      {/* Moment 2: Flick receives */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-16 md:mb-24 lg:mb-28">
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 flex items-center justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{
                background:
                  "linear-gradient(var(--color-canvas-raised), var(--color-canvas-raised)) padding-box, linear-gradient(to right, var(--accent), hsl(var(--accent-hue) 80% 16%)) border-box",
                border: "1px solid transparent",
              }}
            >
              <Play className="w-3 h-3 text-[var(--accent)]" />
              <span className="text-sm font-sans font-medium text-[#8A8A90]">Step 02 — Play</span>
            </div>
          </div>
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F5F5F5] mb-3">
            Flick takes the baton
          </h3>
          <p className="text-sm text-[#8A8A90] leading-relaxed">
            Flick receives the decrypted buffer and begins playback instantly. 
            UAC 2.0 DAC routes the cleanest possible signal to your headphones.
          </p>
        </motion.div>

        {/* Image block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="relative rounded-2xl overflow-hidden brutal-border aspect-[16/10]">
            <img
              src="/assets/flick_banner.png"
              alt="Flick Player interface"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0B]/80 via-transparent to-transparent" />

            {/* Floating glass badge */}
            <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 glass rounded-xl px-3 py-2.5 md:px-4 md:py-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-sans font-medium text-[#F5F5F5] uppercase tracking-wider">UAC 2.0</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description grid — ecosystem/ethos divider style */}
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative py-10 px-8 md:px-10 text-center"
          >
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

            <div className="flex justify-center">
              <Zap
                size={24}
                strokeWidth={1.5}
                className="text-[var(--accent)] mb-6"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
              Instant resume
            </h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              Playback starts in &lt;200ms
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative py-10 px-8 md:px-10 text-center"
          >
            {/* No right divider — last column */}
            {/* No bottom divider — last row */}

            <div className="flex justify-center">
              <Play
                size={24}
                strokeWidth={1.5}
                className="text-[var(--accent)] mb-6"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
              Gapless continuation
            </h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              Album playback uninterrupted
            </p>
          </motion.div>
        </div>
      </div>

      {/* Connection line — decorative, spans full width */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 md:mt-16 lg:mt-24">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-px bg-white/10 origin-left"
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
            style={{
              background:
                "linear-gradient(var(--color-canvas-raised), var(--color-canvas-raised)) padding-box, linear-gradient(to right, var(--accent), hsl(var(--accent-hue) 80% 16%)) border-box",
              border: "1px solid transparent",
            }}
          >
            <Check className="w-3 h-3 text-[var(--accent)]" />
            <span className="text-sm font-sans font-medium text-[#8A8A90]">Handoff Complete</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
