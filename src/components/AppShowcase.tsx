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
  Download,
} from "lucide-react"
import { useGitHubRelease } from "@/hooks/useGitHubRelease"

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
  const latchVersion = useGitHubRelease("Latch").version
  const flickVersion = useGitHubRelease("Flick").version

  return (
    <section id="apps" className="relative py-16 md:py-20 lg:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3 justify-center md:justify-start">
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span className="text-sm font-sans font-medium text-[#8A8A90]">App Showcase</span>
          </div>
          <h2 className="text-display text-[clamp(2rem,5vw,4rem)] text-[#F5F5F5] max-w-2xl text-center md:text-left">
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
              <div className="px-4 py-3 sm:px-6 sm:py-4 brutal-border-b flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-sans font-medium text-[var(--accent)]">01</span>
                  <span className="text-xs font-sans font-medium text-[#F5F5F5] uppercase tracking-wider">
                    Latch
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-sans font-medium">{latchVersion ?? "all free"}</span>
                  <span className="text-xs font-sans font-medium text-[#8A8A90]">Google Play</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
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

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mossapps.locker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:gap-3 transition-all"
                  >
                    Get on Google Play <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/moss-apps/Latch/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    GitHub Releases
                  </a>
                </div>
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
              <div className="px-4 py-3 sm:px-6 sm:py-4 brutal-border-b flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-sans font-medium text-[var(--accent)]">02</span>
                  <span className="text-xs font-sans font-medium text-[#F5F5F5] uppercase tracking-wider">
                    Flick
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-sans font-medium">{flickVersion ?? "v0.16.0-beta.1"}</span>
                  <span className="text-xs font-sans font-medium text-[#8A8A90]">Google Play</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
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

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mossapps.flick"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:gap-3 transition-all"
                  >
                    Get on Google Play <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/moss-apps/Flick/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    GitHub Releases
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
