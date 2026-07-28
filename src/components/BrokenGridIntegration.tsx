import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Play, Zap, Fingerprint, Cpu, ChevronDown } from "lucide-react"

type Feature = { icon: LucideIcon; label: string; hint: string }

const steps: {
  n: string
  title: string
  body: string
  img: string
  alt: string
  gradient: string
  features: Feature[]
}[] = [
  {
    n: "01",
    title: "Choose media in Latch",
    body: "Browse your encrypted vault. Tap any audio file and the handoff protocol prepares a secure in-memory buffer. The file never touches unencrypted disk.",
    img: "/assets/latch_banner.png",
    alt: "Latch interface",
    gradient: "bg-gradient-to-r from-[#0A0A0B]/80",
    features: [
      { icon: Fingerprint, label: "Biometric unlock", hint: "Face or fingerprint" },
      { icon: Cpu, label: "Memory-only decode", hint: "Zero temp files" },
    ],
  },
  {
    n: "02",
    title: "Flick takes the baton",
    body: "Flick receives the decrypted buffer and begins playback instantly. UAC 2.0 DAC routes the cleanest possible signal to your headphones.",
    img: "/assets/flick_banner.png",
    alt: "Flick Player interface",
    gradient: "bg-gradient-to-l from-[#0A0A0B]/80",
    features: [
      { icon: Zap, label: "Instant resume", hint: "Playback in <200ms" },
      { icon: Play, label: "Gapless continuation", hint: "Albums uninterrupted" },
    ],
  },
]

export function BrokenGridIntegration() {
  return (
    <section
      id="integration"
      className="relative py-16 md:py-20 lg:py-32 overflow-hidden"
    >
      {/* Radial accent glow */}
      <div
        className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[600px] h-[600px] max-w-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 md:mb-20 text-center"
        >
          <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-[#F5F5F5]">
            Seamless handoff.
            <span className="text-[#8A8A90]"> Zero friction.</span>
          </h2>
          <p className="mt-5 text-sm text-[#8A8A90] max-w-lg mx-auto leading-relaxed">
            Latch hands media to Flick over an in-memory buffer, no temp files,
            no re-decrypt, no exposed disk.
          </p>
        </motion.div>

        {steps.map((step, i) => (
          <div key={step.n}>
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative brutal-border overflow-hidden"
            >
              <span className="absolute top-5 left-6 z-10 text-display text-2xl text-[#5A5A60] select-none">
                {step.n}
              </span>
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={step.img}
                  alt={step.alt}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 ${step.gradient} via-transparent to-transparent`}
                />
              </div>
              <div className="p-8 md:p-10">
                <h3 className="font-display text-2xl md:text-3xl text-[#F5F5F5] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#8A8A90] leading-relaxed mb-6 max-w-2xl">
                  {step.body}
                </p>
                <div className="flex flex-wrap gap-3">
                  {step.features.map((f) => (
                    <div
                      key={f.label}
                      className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.03]"
                    >
                      <f.icon
                        size={16}
                        strokeWidth={1.5}
                        className="text-[var(--accent)]"
                      />
                      <span className="text-sm text-[#F5F5F5]">{f.label}</span>
                      <span className="text-xs text-[#5A5A60] hidden sm:inline">
                        {f.hint}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>

            {i < steps.length - 1 && (
              <div
                className="flex flex-col items-center my-6 md:my-8"
                aria-hidden="true"
              >
                <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                <ChevronDown className="w-4 h-4 text-[#5A5A60]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
