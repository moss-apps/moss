import { motion } from "framer-motion"
import { Shield, ArrowRightLeft, ArrowRight, Download, Lock, EyeOff, Timer, FolderOpen, AudioWaveform, HardDrive, Headphones, Radio } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const tile = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export function BentoSpine() {
  return (
    <section id="spine" className="relative py-16 md:py-20 lg:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section head */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16 px-2"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-[var(--accent)]" />
            <span className="text-sm font-sans font-medium text-[#8A8A90]">The Ecosystem</span>
          </div>
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] text-[#F5F5F5] max-w-xl">
            One backbone.
            <span className="text-[#8A8A90]"> Two apps. Infinite use.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-min"
        >
          {/* Tile 1: Ecosystem manifesto — spans 2 cols */}
          <motion.div
            variants={tile}
            className="md:col-span-2 lg:col-span-2 glass rounded-2xl p-4 sm:p-6 md:p-6 lg:p-8 flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-display text-lg text-[#F5F5F5] mb-1">Secure by design</h3>
                <p className="text-sm text-[#8A8A90] leading-relaxed max-w-sm">
                  Every file is encrypted at rest. Every handoff happens in memory. We don&apos;t have keys we can hand over — because we never hold them.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs font-sans font-medium text-[#8A8A90]">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">AES-256</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Zero-Knowledge</span>
            </div>
          </motion.div>

          {/* Tile 2: Latch banner — spans 2 cols, taller */}
          <motion.div
            variants={tile}
            className="md:col-span-1 lg:col-span-2 glass rounded-2xl overflow-hidden min-h-[260px] relative group"
          >
            <img
              src="/assets/latch_banner.png"
              alt="Latch app banner"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent" />
            <div className="relative p-4 sm:p-6 md:p-6 lg:p-8 h-full flex flex-col justify-end">
              <div className="text-sm font-sans font-medium text-[var(--accent)] mb-2">Latch</div>
              <h3 className="font-display text-2xl text-[#F5F5F5] mb-2">Latch Secure Vault</h3>
              <p className="text-sm text-[#8A8A90] max-w-sm">
                Hide, encrypt, and organize sensitive media. Decoy mode and auto-kill triggers included.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
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
                  className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-all"
                >
                  <Download className="w-4 h-4" />
                  GitHub Releases
                </a>
              </div>
            </div>
          </motion.div>

          {/* Tile 3: Flick banner — spans 2 cols, taller */}
          <motion.div
            variants={tile}
            className="md:col-span-1 lg:col-span-2 glass rounded-2xl overflow-hidden min-h-[260px] relative group"
          >
            <img
              src="/assets/flick_banner.png"
              alt="Flick Player banner"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent" />
            <div className="relative p-4 sm:p-6 md:p-6 lg:p-8 h-full flex flex-col justify-end">
              <div className="text-sm font-sans font-medium text-[var(--accent)] mb-2">Flick</div>
              <h3 className="font-display text-2xl text-[#F5F5F5] mb-2">Flick Player</h3>
              <p className="text-sm text-[#8A8A90] max-w-sm">
                Audiophile-grade playback with UAC 2.0 DAC support. Gapless, lossless, focused.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
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
          </motion.div>

          {/* Tile 4: Latch features */}
          <motion.div variants={tile} className="glass rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="text-xs font-sans font-medium text-[#8A8A90] mb-1">Latch Features</div>
            <FeatureRow icon={Lock} label="AES-256 Encryption" />
            <FeatureRow icon={EyeOff} label="Decoy Mode" />
            <FeatureRow icon={Timer} label="Auto-Kill Timer" />
            <FeatureRow icon={FolderOpen} label="Folder Vaults" />
          </motion.div>

          {/* Tile 5: Flick features */}
          <motion.div variants={tile} className="glass rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="text-xs font-sans font-medium text-[#8A8A90] mb-1">Flick Features</div>
            <FeatureRow icon={AudioWaveform} label="Lossless Playback" />
            <FeatureRow icon={HardDrive} label="UAC 2.0 DAC" />
            <FeatureRow icon={Headphones} label="Hi-Res 32-bit" />
            <FeatureRow icon={Radio} label="Gapless Audio" />
          </motion.div>

          {/* Tile 6: Handoff teaser — spans 2 cols on desktop */}
          <motion.div
            variants={tile}
            className="md:col-span-1 lg:col-span-2 glass rounded-2xl p-4 sm:p-6 md:p-6 lg:p-8 flex flex-col justify-center min-h-[180px]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1"
                style={{
                  background:
                    "linear-gradient(var(--color-canvas-raised), var(--color-canvas-raised)) padding-box, linear-gradient(to right, var(--accent), hsl(var(--accent-hue) 80% 16%)) border-box",
                  border: "1px solid transparent",
                }}
              >
                <ArrowRightLeft className="w-3 h-3 text-[var(--accent)]" />
                <span className="text-sm font-sans font-medium text-[#8A8A90]">Handoff Protocol</span>
              </div>
            </div>
            <p className="text-sm text-[#8A8A90] leading-relaxed max-w-md">
              Tap a track in Latch, it opens in Flick — instantly. No export. No temp files. Memory-only handoff with full encryption intact.
            </p>
          </motion.div>

          {/* Tile 7: Stats tile */}
          <motion.div variants={tile} className="glass rounded-2xl p-4 sm:p-6 md:p-6 flex flex-col justify-center items-center text-center min-h-[160px]">
            <div className="font-display text-4xl text-[var(--accent)] mb-1">2</div>
            <div className="text-xs font-sans font-medium text-[#8A8A90]">Apps Live</div>
          </motion.div>

          {/* Tile 8: OSS badge */}
          <motion.div variants={tile} className="glass rounded-2xl p-4 sm:p-6 md:p-6 flex flex-col justify-center items-center text-center min-h-[160px]">
            <div className="font-display text-4xl text-[var(--accent)] mb-1">0</div>
            <div className="text-xs font-sans font-medium text-[#8A8A90]">Lines of tracking code</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureRow({ icon: Icon, label }: { icon: typeof Lock; label: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
      <span className="text-sm text-[#F5F5F5]">{label}</span>
    </div>
  )
}
