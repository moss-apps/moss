import { motion } from "framer-motion"
import { Shield, Music, ArrowRightLeft } from "lucide-react"

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
    <section id="ecosystem" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-label mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>// 01 — THE_ECOSYSTEM</span>
          </div>
          <h2 className="text-display text-[clamp(2rem,5vw,4rem)] text-[#F5F5F5] max-w-2xl">
            One secure backbone.
            <br />
            <span className="text-[#8A8A90]">Two powerful apps.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          <motion.div variants={item} className="glass glass-hover rounded-xl p-8 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6">
              <Shield className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">Latch</h3>
            <p className="text-[#8A8A90] text-sm leading-relaxed">
              A secure media vault with AES-256 encryption, decoy mode, auto-kill
              triggers, and folder-based organization. Your files stay yours.
            </p>
          </motion.div>

          <motion.div variants={item} className="glass glass-hover rounded-xl p-8 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6">
              <Music className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">Flick Player</h3>
            <p className="text-[#8A8A90] text-sm leading-relaxed">
              An audiophile-grade music player with UAC 2.0 support, lossless
              playback, and a tactile interface designed for focused listening.
            </p>
          </motion.div>

          <motion.div variants={item} className="glass glass-hover rounded-xl p-8 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-6">
              <ArrowRightLeft className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">Handoff</h3>
            <p className="text-[#8A8A90] text-sm leading-relaxed">
              Seamless playback continuity between Latch and Flick. Start in the
              vault, finish in the player — zero friction, zero delay.
            </p>
          </motion.div>
        </motion.div>

        {/* Connection diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 flex items-center justify-center"
        >
          <div className="relative flex items-center gap-8 md:gap-16">
            {/* Latch node */}
            <div className="glass rounded-xl px-8 py-6 text-center min-w-[140px]">
              <Shield className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
              <div className="font-display text-[#F5F5F5]">Latch</div>
              <div className="text-label mt-1">Vault</div>
            </div>

            {/* Connection line with dots */}
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
              <ArrowRightLeft className="w-4 h-4 text-[#8A8A90] ml-2" />
            </div>

            {/* Flick node */}
            <div className="glass rounded-xl px-8 py-6 text-center min-w-[140px]">
              <Music className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
              <div className="font-display text-[#F5F5F5]">Flick</div>
              <div className="text-label mt-1">Player</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
