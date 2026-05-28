import { motion } from "framer-motion"
import { Code2, Heart, Globe, Mail } from "lucide-react"

export function Ethos() {
  return (
    <section id="ethos" className="relative py-24 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <div className="text-label mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-[var(--accent)]" />
            <span>Design Ethos</span>
          </div>
          <h2 className="text-display text-[clamp(1.75rem,4vw,3rem)] text-[#F5F5F5] max-w-2xl">
            Open source. Free forever.
            <span className="text-[#8A8A90]"> No ads, no tracking, no compromise.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <Code2 className="w-6 h-6 text-[var(--accent)] mb-4" />
            <h3 className="font-display text-lg text-[#F5F5F5] mb-2">Open Source</h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              Every line is inspectable, forkable, and improvable. Security through 
              obscurity is no security at all.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <Heart className="w-6 h-6 text-[var(--accent)] mb-4" />
            <h3 className="font-display text-lg text-[#F5F5F5] mb-2">User First</h3>
            <p className="text-sm text-[#8A8A90] leading-relaxed">
              No ads. No analytics. No data collection. Your device, your files, 
              your experience. We don&apos;t want your data.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <Globe className="w-6 h-6 text-[var(--accent)] mb-4" />
            <h3 className="font-display text-lg text-[#F5F5F5] mb-2">Accessible</h3>
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
          className="glass rounded-2xl p-6 md:p-10 lg:p-12 relative overflow-hidden"
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
            <div className="mt-8 flex items-center gap-3">
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
