import { motion } from "framer-motion"
import {
  Lock,
  EyeOff,
  Timer,
  FolderOpen,
  Headphones,
  AudioWaveform,
  HardDrive,
  Radio,
  ArrowRight,
} from "lucide-react"

const latchFeatures = [
  { icon: Lock, label: "AES-256 Encryption", desc: "Military-grade file protection" },
  { icon: EyeOff, label: "Decoy Mode", desc: "Plausible deniability layer" },
  { icon: Timer, label: "Auto-Kill", desc: "Timed self-destruct triggers" },
  { icon: FolderOpen, label: "Folder Vaults", desc: "Organized secure containers" },
]

const flickFeatures = [
  { icon: AudioWaveform, label: "Lossless Playback", desc: "FLAC, ALAC, WAV, DSD" },
  { icon: HardDrive, label: "UAC 2.0", desc: "USB Audio Class support" },
  { icon: Headphones, label: "Hi-Res Audio", desc: "Up to 32-bit / 384kHz" },
  { icon: Radio, label: "Gapless", desc: "Seamless album playback" },
]

export function AppShowcase() {
  return (
    <section id="apps" className="relative py-32 px-6">
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
            <span>// 02 — APP_SHOWCASE</span>
          </div>
          <h2 className="text-display text-[clamp(2rem,5vw,4rem)] text-[#F5F5F5] max-w-2xl">
            Built with intent.
            <br />
            <span className="text-[#8A8A90]">No filler, no ads.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Latch Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/30">
              {/* Brutalist header */}
              <div className="px-6 py-4 brutal-border-b flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-label text-[var(--accent)]">// 01</span>
                  <span className="font-mono text-xs text-[#F5F5F5] uppercase tracking-wider">
                    LATCH
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-label">v2.1.0</span>
                  <span className="text-label text-[#8A8A90]">Android / iOS</span>
                </div>
              </div>

              <div className="p-8">
                <h3 className="font-display text-2xl text-[#F5F5F5] mb-2">
                  Latch Secure Vault
                </h3>
                <p className="text-[#8A8A90] text-sm mb-8 max-w-md">
                  Your photos, videos, and documents locked behind encryption
                  that even we can't break. Decoy mode, biometric unlock, and
                  automatic data destruction.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {latchFeatures.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <f.icon className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm text-[#F5F5F5]">{f.label}</div>
                        <div className="text-xs text-[#8A8A90] mt-0.5">
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:gap-3 transition-all"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Flick Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group"
          >
            <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/30">
              {/* Brutalist header */}
              <div className="px-6 py-4 brutal-border-b flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-label text-[var(--accent)]">// 02</span>
                  <span className="font-mono text-xs text-[#F5F5F5] uppercase tracking-wider">
                    FLICK
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-label">v1.3.2</span>
                  <span className="text-label text-[#8A8A90]">Android / iOS</span>
                </div>
              </div>

              <div className="p-8">
                <h3 className="font-display text-2xl text-[#F5F5F5] mb-2">
                  Flick Player
                </h3>
                <p className="text-[#8A8A90] text-sm mb-8 max-w-md">
                  An audiophile music player that respects your ears and your
                  files. UAC 2.0 DAC support, bit-perfect playback, and a
                  minimal interface that gets out of the way.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {flickFeatures.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <f.icon className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm text-[#F5F5F5]">{f.label}</div>
                        <div className="text-xs text-[#8A8A90] mt-0.5">
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:gap-3 transition-all"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
