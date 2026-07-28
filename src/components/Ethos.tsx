import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Code2, Heart, Globe, Mail } from "lucide-react"
import Ferrofluid from "./Ferrofluid"
import { useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const principles: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Code2,
    title: "Open source",
    body: "Every line is inspectable, forkable, and improvable. Security through obscurity is no security at all.",
  },
  {
    icon: Heart,
    title: "User first",
    body: "No ads. No analytics. No data collection. Your device, your files, your experience. We don't want your data.",
  },
  {
    icon: Globe,
    title: "Accessible",
    body: "Performance mode, reduced motion, and high-contrast options built in from day one. Design for everyone.",
  },
]

export function Ethos() {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)
  const showShader = !isMobile && !performanceMode && !reducedMotion

  return (
    <section
      id="ethos"
      className="relative py-16 md:py-20 lg:py-32 px-4 md:px-6 overflow-hidden"
    >
      {/* Dot-grid texture — 2px dots, 16px spacing, 3% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* Radial accent glow */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[600px] max-w-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 md:mb-16 text-center"
        >
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] text-[#F5F5F5]">
            Open source. Free forever.
            <span className="text-[#8A8A90]">
              {" "}
              No ads, no tracking, no compromise.
            </span>
          </h2>
          <p className="mt-5 text-sm text-[#8A8A90] max-w-md mx-auto leading-relaxed">
            Every Moss app answers to three rules before it ships. None of them
            are optional.
          </p>
        </motion.div>

        {/* One panel: three principle tiles + merged manifesto, shared shader bg */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative brutal-border overflow-hidden"
        >
          {showShader && (
            <div className="absolute inset-0 pointer-events-none">
              <Ferrofluid
                opacity={0.4}
                colors={["#14B8A6", "#0EA5E9", "#5EEAD4"]}
                flowDirection="right"
                speed={0.28}
                scale={2.6}
                turbulence={0.7}
                fluidity={0.12}
                rimWidth={0.28}
                sharpness={2.2}
                shimmer={1.2}
                glow={1.6}
                frameSkip={2}
                mouseInteraction={false}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/40 via-[#0A0A0B]/50 to-[#0A0A0B]/65 pointer-events-none" />

          <div className="relative">
            {/* Three principle tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-white/15 md:divide-y-0 md:divide-x border-b border-white/15">
              {principles.map((p) => (
                <motion.div
                  key={p.title}
                  variants={item}
                  className="relative p-8 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 mb-6">
                    <p.icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-[var(--accent)]"
                    />
                  </div>
                  <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[#C5C5CA] leading-relaxed">
                    {p.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Manifesto — merged into the same panel */}
            <div className="relative p-8 md:p-10 lg:p-12">
              <div className="absolute top-0 right-0 w-48 h-48 dot-pattern opacity-[0.07] pointer-events-none" />
              <div className="relative max-w-2xl">
                <div className="text-sm font-medium text-[var(--accent)] mb-6">
                  Manifesto
                </div>
                <blockquote className="space-y-4">
                  <p className="text-base md:text-lg text-[#C5C5CA] leading-relaxed">
                    We build tools we want to use. Tools that respect the user.
                    Tools that don&apos;t phone home, don&apos;t sell attention,
                    and don&apos;t treat privacy as a premium feature.
                  </p>
                  <p className="text-base md:text-lg text-[#C5C5CA] leading-relaxed">
                    Moss is not a startup. It is a statement.
                  </p>
                  <p className="font-display text-xl md:text-2xl text-[#F5F5F5] leading-snug">
                    Software can be pretty, secure, and free all at once.
                  </p>
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <a
                    href="mailto:moss_apps@proton.me"
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    moss_apps@proton.me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
