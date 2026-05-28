import { motion } from "framer-motion"
import { Play, Lock, Zap, ArrowRight, Fingerprint, Cpu } from "lucide-react"

export function BrokenGridIntegration() {
  return (
    <section id="integration" className="relative py-24 md:py-32 overflow-hidden">
      {/* Section label — offset left, brutalist */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-label mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-[var(--accent)]" />
            <span>Cross-App Integration</span>
          </div>
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] text-[#F5F5F5] max-w-xl">
            Seamless handoff.
            <span className="text-[#8A8A90]"> Zero friction.</span>
          </h2>
        </motion.div>
      </div>

      {/* Broken Grid Moment 1: Latch → Flick handoff flow */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20 md:mb-28">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Image block — breaks left on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8 lg:-ml-12 xl:-ml-20 relative"
          >
            <div className="relative rounded-2xl overflow-hidden brutal-border aspect-[16/10]">
              <img
                src="/assets/latch_banner.png"
                alt="Latch interface"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/80 via-transparent to-transparent" />
              
              {/* Floating glass badge — breaks out of image */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 glass rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-xs font-mono text-[#F5F5F5] uppercase tracking-wider">Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text block — offset right, overlapping feel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-4 lg:-ml-6 relative z-10"
          >
            <div className="glass rounded-2xl p-4 md:p-5 brutal-border">
              <div className="text-label text-[var(--accent)] mb-3">STEP_01 — SELECT</div>
              <h3 className="font-display text-lg md:text-xl text-[#F5F5F5] mb-2">
                Choose media in Latch
              </h3>
              <p className="text-sm text-[#8A8A90] leading-relaxed mb-4">
                Browse your encrypted vault. Tap any audio file. The handoff protocol 
                prepares a secure in-memory buffer — the file never touches unencrypted disk.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Fingerprint className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm text-[#F5F5F5]">Biometric unlock</div>
                    <div className="text-xs text-[#8A8A90]">Face or fingerprint required</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm text-[#F5F5F5]">Memory-only decode</div>
                    <div className="text-xs text-[#8A8A90]">Zero temp file writes</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Broken Grid Moment 2: Flick receives — reversed asymmetry */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20 md:mb-28">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Text block — offset left, comes first on mobile but reordered on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 lg:col-start-1 lg:-mr-6 relative z-10 order-2 lg:order-1"
          >
            <div className="glass rounded-2xl p-4 md:p-5 brutal-border">
              <div className="text-label text-[var(--accent)] mb-3">STEP_02 — PLAY</div>
              <h3 className="font-display text-lg md:text-xl text-[#F5F5F5] mb-2">
                Flick takes the baton
              </h3>
              <p className="text-sm text-[#8A8A90] leading-relaxed mb-4">
                Flick receives the decrypted buffer and begins playback instantly. 
                UAC 2.0 DAC routes the cleanest possible signal to your headphones.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm text-[#F5F5F5]">Instant resume</div>
                    <div className="text-xs text-[#8A8A90]">Playback starts in &lt;200ms</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Play className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm text-[#F5F5F5]">Gapless continuation</div>
                    <div className="text-xs text-[#8A8A90]">Album playback uninterrupted</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image block — breaks right on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-8 lg:col-start-5 lg:-mr-12 xl:-mr-20 relative order-1 lg:order-2"
          >
            <div className="relative rounded-2xl overflow-hidden brutal-border aspect-[16/10]">
              <img
                src="/assets/flick_banner.png"
                alt="Flick Player interface"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0B]/80 via-transparent to-transparent" />
              
              {/* Floating glass badge — breaks out */}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 glass rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#F5F5F5] uppercase tracking-wider">UAC 2.0</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Connection line — decorative, spans full width */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-px bg-white/10 origin-left"
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 glass rounded-full px-4 py-1.5 flex items-center gap-2">
            <ArrowRight className="w-3 h-3 text-[var(--accent)]" />
            <span className="text-label">HANDOFF_COMPLETE</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
