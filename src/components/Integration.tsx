import { motion } from "framer-motion"
import { Play, Lock, ArrowRight, Zap } from "lucide-react"

export function Integration() {
  return (
    <section id="integration" className="relative py-16 md:py-20 lg:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3 justify-center">
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span className="text-sm font-sans font-medium text-[#8A8A90]">Cross App Integration</span>
          </div>
          <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-[#F5F5F5] w-full text-center">
            Seamless handoff.
            <br />
            <span className="text-[#8A8A90]">Zero friction playback.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual: Flow diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass rounded-xl p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="flex flex-col items-center gap-6">
                {/* Latch bubble */}
                <motion.div
                  className="w-full glass rounded-lg p-5 border border-[var(--accent)]/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="font-display text-[#F5F5F5]">Latch</div>
                      <div className="text-xs font-sans font-medium text-[#8A8A90]">Secure media selected</div>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow with animated dots */}
                <div className="flex flex-col items-center gap-1">
                  <ArrowRight className="w-5 h-5 text-[var(--accent)] rotate-90" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-[var(--accent)]"
                        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Flick bubble */}
                <motion.div
                  className="w-full glass rounded-lg p-5 border border-[var(--accent)]/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                      <Play className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="font-display text-[#F5F5F5]">Flick</div>
                      <div className="text-xs font-sans font-medium text-[#8A8A90]">Playback resumed</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-white/5" />
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="font-display text-2xl text-[#F5F5F5]">
                From vault to player in one tap
              </h3>
              <p className="text-[#8A8A90] leading-relaxed">
                No exporting. No temporary files. No cloud round-trips. When you
                select a track in Latch, Flick opens it via a secure in-memory
                handoff. The file stays encrypted until the moment of decode.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] brutal-border">
                <Zap className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm text-[#F5F5F5] font-medium">
                    Instant resume
                  </div>
                  <div className="text-xs text-[#8A8A90] mt-1">
                    Pick up exactly where you left off across both apps
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] brutal-border">
                <Lock className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm text-[#F5F5F5] font-medium">
                    Memory-only handoff
                  </div>
                  <div className="text-xs text-[#8A8A90] mt-1">
                    Decrypted buffers never touch disk
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
