import { Link } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  GitCommit,
  Smartphone,
} from "lucide-react"
import { PlasmaWave } from "@/components/PlasmaWave"
import { DiagonalMockupShowcase } from "@/components/DiagonalMockupShowcase"
import { useGitHubRelease } from "@/hooks/useGitHubRelease"
import { APPS, type AppInfo } from "@/lib/apps"

export function AppPage({ app }: { app: AppInfo }) {
  const version = useGitHubRelease(app.repo).version
  const other = APPS[app.slug === "flick" ? "latch" : "flick"]

  const infoText = version
    ? `${app.name} ${version} / Android 8+ / Open Source`
    : `${app.name} / Android 8+ / Open Source`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: app.name,
    operatingSystem: "Android",
    applicationCategory:
      app.slug === "latch" ? "SecurityApplication" : "MultimediaApplication",
    description: app.description,
    downloadUrl: app.playUrl,
    softwareVersion: version ?? undefined,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Moss Laboratories" },
  }

  return (
    <main className="relative min-h-screen bg-[#0A0A0B]">
      <title>{`${app.name} — ${app.tagline} — Moss Laboratories`}</title>
      <meta name="description" content={app.description} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PlasmaWave />

      <div className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Moss
          </Link>

          {/* Header */}
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <img src={app.logo} alt="" className="h-9 w-auto" />
                <span className="text-label">{app.label}</span>
                {version && (
                  <span className="font-mono text-xs text-[#6A6A70]">
                    {version}
                  </span>
                )}
              </div>

              <h1 className="font-display text-5xl sm:text-6xl font-medium tracking-tight text-[#F5F5F5] mb-3">
                {app.name}
              </h1>
              <p
                className="font-mono text-xs uppercase tracking-wider mb-6"
                style={{ color: app.color }}
              >
                {app.tagline}
              </p>

              <p className="text-[#8A8A90] leading-relaxed max-w-xl mb-7">
                {app.description}
              </p>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-9">
                {app.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2.5 text-sm text-[#C5C5CA]"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={app.playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md bg-[var(--accent)] text-[#0A0A0B] hover:brightness-110 transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <Smartphone className="w-4 h-4" />
                  Get on Google Play
                </a>
                <a
                  href={app.releasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-white/15 text-[#F5F5F5] hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <Download className="w-4 h-4" />
                  GitHub Releases
                </a>
                {app.siteUrl && (
                  <a
                    href={app.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Official site
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div
                className="absolute -inset-6 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${app.color}14 0%, transparent 70%)`,
                }}
              />
              <img
                src={app.banner}
                alt={`${app.name} app banner`}
                className="relative w-full border border-white/10"
                loading="eager"
              />
            </motion.div>
          </div>

          {/* Info strip */}
          <div
            className="flex items-center justify-between flex-wrap gap-3 py-4 mb-14"
            style={{
              borderTop: "1px solid transparent",
              borderBottom: "1px solid transparent",
              borderImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.14) 20%, rgba(255,255,255,0.14) 80%, rgba(255,255,255,0.06) 100%) 1",
            }}
          >
            <span className="font-mono text-xs text-[#6A6A70]">{infoText}</span>
            <div className="flex items-center gap-5">
              <Link
                to="/changelog"
                className="inline-flex items-center gap-1.5 text-xs text-[#8A8A90] hover:text-[var(--accent)] transition-colors"
              >
                <GitCommit className="w-3.5 h-3.5" />
                Changelog
              </Link>
              <Link
                to="/downloads"
                className="inline-flex items-center gap-1.5 text-xs text-[#8A8A90] hover:text-[var(--accent)] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                All downloads
              </Link>
            </div>
          </div>

          {/* Features */}
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {app.features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5"
              >
                <feature.icon
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: app.color }}
                />
                <div>
                  <div className="text-sm text-[#F5F5F5]">{feature.label}</div>
                  <div className="text-xs text-[#8A8A90] mt-0.5">
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DiagonalMockupShowcase
        id={app.slug}
        appName={app.name}
        logoSrc={app.logo}
        headerLabel={`${app.name} / ${app.tagline}`}
        infoText={infoText}
        mockups={app.mockups}
        screenNames={app.screenNames}
        callouts={app.callouts}
      />

      {/* Cross-link */}
      <div className="relative z-10 px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <Link
            to={`/${other.slug}`}
            className="group flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 border border-white/10 hover:border-[var(--accent)]/40 transition-colors"
          >
            <div className="flex items-center gap-4">
              <img src={other.logo} alt="" className="h-8 w-auto" />
              <div>
                <p className="text-label mb-1">Also in the ecosystem</p>
                <p className="font-display text-xl text-[#F5F5F5]">
                  {other.name}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-[#8A8A90] group-hover:text-[var(--accent)] group-hover:gap-3 transition-all">
              Explore {other.name}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
