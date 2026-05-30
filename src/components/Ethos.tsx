import { motion } from "framer-motion"
import { Code2, Heart, Globe, Mail } from "lucide-react"

export function Ethos() {
  return (
    <section id="ethos" className="relative py-16 md:py-20 lg:py-32 px-4 md:px-6">
      {/* Dot-grid texture — 2px dots, 16px spacing, 3% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <div className="text-label mb-3 flex items-center gap-3 justify-center">
            <span className="w-6 h-px bg-[var(--accent)]" />
            <span>Design Ethos</span>
          </div>
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] text-[#F5F5F5] w-full text-center">
            Open source. Free forever.
            <span className="text-[#8A8A90]"> No ads, no tracking, no compromise.</span>
          </h2>
        </motion.div>

        {/* Matrix grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 mb-16">
          {/* Open Source */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative py-12 px-10 text-center md:text-left"
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

            <div className="flex justify-center md:justify-start">
              <Code2
                size={24}
                strokeWidth={1.5}
                className="text-[var(--accent)] mb-6"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
              Open Source
            </h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              Every line is inspectable, forkable, and improvable. Security through
              obscurity is no security at all.
            </p>
          </motion.div>

          {/* User First */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative py-12 px-10 text-center md:text-left"
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

            <div className="flex justify-center md:justify-start">
              <Heart
                size={24}
                strokeWidth={1.5}
                className="text-[var(--accent)] mb-6"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
              User First
            </h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              No ads. No analytics. No data collection. Your device, your files,
              your experience. We don&apos;t want your data.
            </p>
          </motion.div>

          {/* Accessible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative py-12 px-10 text-center md:text-left"
          >
            {/* No right divider — last column */}
            {/* No bottom divider — last row */}

            <div className="flex justify-center md:justify-start">
              <Globe
                size={24}
                strokeWidth={1.5}
                className="text-[var(--accent)] mb-6"
              />
            </div>
            <h3 className="font-display text-xl text-[#F5F5F5] mb-3">
              Accessible
            </h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              Performance mode, reduced motion, and high-contrast options built
              in from day one. Design for everyone.
            </p>
          </motion.div>
        </div>

        {/* Manifesto block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="border border-white/[0.08] p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 dot-pattern opacity-[0.07]" />
          <div className="relative max-w-2xl">
            <div className="text-label text-[var(--accent)] mb-6">
              // MANIFESTO_001
            </div>
            <blockquote className="font-mono text-sm md:text-base text-[#8A8A90] leading-relaxed space-y-4">
              <p>
                We build tools we want to use. Tools that respect the user.
                Tools that don&apos;t phone home, don&apos;t sell attention, and don&apos;t
                treat privacy as a premium feature.
              </p>
              <p>
                Moss is not a startup. It is a statement. Software can be
                beautiful, secure, and free — all at once.
              </p>
            </blockquote>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
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
        </motion.div>
      </div>
    </section>
  )
}
