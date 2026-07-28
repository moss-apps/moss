import { useState, useMemo, useRef } from "react"
import { Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { ArrowLeft, ExternalLink, Calendar, GitCommit, AlertCircle, Loader2 } from "lucide-react"
import { PlasmaWave } from "@/components/PlasmaWave"
import { useGitHubReleases, type GitHubRelease } from "@/hooks/useGitHubReleases"

const REPOS = ["Latch", "Flick"] as const
type Repo = (typeof REPOS)[number]

const REPO_META: Record<Repo, { label: string; githubUrl: string; logo: string }> = {
  Latch: {
    label: "Latch",
    githubUrl: "https://github.com/moss-apps/Latch/releases",
    logo: "/assets/logos/latch_logo.svg",
  },
  Flick: {
    label: "Flick",
    githubUrl: "https://github.com/moss-apps/Flick/releases",
    logo: "/assets/logos/flick_logo.svg",
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "2-digit",
    month: "short",
    day: "numeric",
  })
}

function VersionPill({
  release,
  isSelected,
  isLatest,
  onClick,
  compact = false,
}: {
  release: GitHubRelease
  isSelected: boolean
  isLatest?: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-left transition-all duration-200 ${
        compact
          ? "px-3 py-2 max-w-[140px] overflow-hidden"
          : "px-4 py-3 w-full"
      } ${
        isSelected
          ? "text-[var(--accent)]"
          : "text-[#F5F5F5] hover:text-[#F5F5F5]"
      }`}
      style={{
        borderBottom: compact ? undefined : "1px solid transparent",
        borderImage: compact
          ? undefined
          : isSelected
            ? "linear-gradient(to right, transparent 0%, var(--accent)40 20%, var(--accent)40 80%, transparent 100%) 1"
            : "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 100%) 1",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`font-mono truncate ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {release.tag_name}
        </span>
        {release.prerelease && (
          <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
            pre
          </span>
        )}
      </div>
      {!compact && (
        <div className="flex items-center gap-2 mt-1 text-xs text-[#6A6A70]">
          <Calendar className="w-3 h-3" />
          <span>{formatDateShort(release.published_at)}</span>
          {isLatest && (
            <span className="ml-auto px-1.5 py-0.5 text-[#8A8A90]">
              latest
            </span>
          )}
        </div>
      )}
    </button>
  )
}

function VersionList({
  releases,
  selectedTag,
  onSelect,
}: {
  releases: GitHubRelease[]
  selectedTag: string | null
  onSelect: (tag: string) => void
}) {
  return (
    <div className="space-y-1.5">
      {releases.map((release, idx) => (
        <VersionPill
          key={release.id}
          release={release}
          isSelected={release.tag_name === selectedTag}
          isLatest={idx === 0}
          onClick={() => onSelect(release.tag_name)}
        />
      ))}
    </div>
  )
}

function VersionStrip({
  releases,
  selectedTag,
  onSelect,
}: {
  releases: GitHubRelease[]
  selectedTag: string | null
  onSelect: (tag: string) => void
}) {
  return (
    <div className="lg:hidden -mx-4 px-4 mb-6">
      <div className="sticky top-28 z-30 overflow-hidden py-3"
        style={{
          borderTop: "1px solid transparent",
          borderBottom: "1px solid transparent",
          borderImage: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="text-label text-[#6A6A70] mb-2 px-1">Version History</div>
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar snap-x snap-mandatory">
          {releases.map((release, idx) => (
            <div key={release.id} className="snap-start">
              <VersionPill
                release={release}
                isSelected={release.tag_name === selectedTag}
                isLatest={idx === 0}
                onClick={() => onSelect(release.tag_name)}
                compact
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReleaseDetail({ release, repo }: { release: GitHubRelease; repo: Repo }) {
  const meta = REPO_META[repo]

  return (
    <motion.div
      key={release.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="relative py-6 sm:py-8 px-0 sm:px-8 rounded-none"
      style={{
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
        borderImage: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 mb-6"
        style={{
          borderBottom: "1px solid transparent",
          borderImage: "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.06) 100%) 1",
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 font-mono text-xs text-[var(--accent)]">
              {release.tag_name}
            </span>
            {release.prerelease && (
              <span className="px-2 py-0.5 text-[#8A8A90] font-mono text-[10px] uppercase tracking-wider">
                Pre-release
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#F5F5F5]">
            {release.name || release.tag_name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[#8A8A90]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(release.published_at)}
            </span>
            <a
              href={release.author.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-[#F5F5F5] transition-colors"
            >
              <img
                src={release.author.avatar_url}
                alt={release.author.login}
                className="w-5 h-5 rounded-full"
                style={{ border: "1px solid rgba(255,255,255,0.10)" }}
              />
              <span>{release.author.login}</span>
            </a>
          </div>
        </div>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto justify-center sm:justify-start inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#8A8A90] hover:text-[#F5F5F5] transition-all"
          style={{
            border: "1px solid transparent",
            borderImage: "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06) 100%) 1",
          }}
        >
          View on GitHub
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Body */}
      <div className="changelog-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {release.body || "No release notes provided."}
        </ReactMarkdown>
      </div>

      {/* Footer link */}
      <div className="mt-8 pt-6 flex items-center justify-between"
        style={{
          borderTop: "1px solid transparent",
          borderImage: "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.06) 100%) 1",
        }}
      >
        <a
          href={meta.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[var(--accent)] transition-colors"
        >
          <img src={meta.logo} alt="" className="w-5 h-5" />
          All {meta.label} releases
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  )
}

export function Changelog() {
  const [activeRepo, setActiveRepo] = useState<Repo>("Flick")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const detailRef = useRef<HTMLElement>(null)

  const { releases, isLoading, error } = useGitHubReleases(activeRepo)

  const effectiveSelectedTag = selectedTag ?? releases[0]?.tag_name ?? null

  const selectedRelease = useMemo(
    () => releases.find((r) => r.tag_name === effectiveSelectedTag),
    [releases, effectiveSelectedTag],
  )

  const handleRepoChange = (repo: Repo) => {
    setActiveRepo(repo)
    setSelectedTag(null)
  }

  const handleVersionSelect = (tag: string) => {
    setSelectedTag(tag)
    if (window.innerWidth < 1024 && detailRef.current) {
      const stripOffset = 170
      const top =
        detailRef.current.getBoundingClientRect().top +
        window.scrollY -
        stripOffset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen bg-[#0A0A0B]">
      <title>Changelog — Moss Laboratories</title>
      <meta
        name="description"
        content="Release history for Latch and Flick — every version, contributor, and change, pulled live from GitHub."
      />
      <PlasmaWave />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moss
        </Link>

        {/* Page header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <GitCommit className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#F5F5F5]">
              Changelog
            </h1>
          </div>
          <p className="text-[#8A8A90] max-w-xl leading-relaxed">
            Browse the release history of Latch and Flick. Every version, every
            contributor, every change — pulled live from GitHub.
          </p>
        </div>

        {/* Repo tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 p-1.5 rounded-full border border-white/10 bg-white/[0.02] w-full sm:w-fit justify-center">
          {REPOS.map((repo) => {
            const meta = REPO_META[repo]
            const isActive = repo === activeRepo
            return (
              <button
                key={repo}
                onClick={() => handleRepoChange(repo)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
                    : "text-[#8A8A90] hover:text-[#F5F5F5] hover:bg-white/5"
                }`}
              >
                <img src={meta.logo} alt="" className="w-4 h-4" />
                {meta.label}
              </button>
            )
          })}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            <p className="text-sm text-[#8A8A90]">
              Fetching {REPO_META[activeRepo].label} releases…
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="p-8 text-center"
            style={{
              borderTop: "1px solid transparent",
              borderBottom: "1px solid transparent",
              borderImage: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent 100%) 1",
            }}
          >
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-xl text-[#F5F5F5] mb-2">
              Couldn&apos;t load releases
            </h2>
            <p className="text-sm text-[#8A8A90] max-w-md mx-auto mb-6">
              GitHub&apos;s API rate limit may have been reached, or the
              network is unavailable. Try again in a moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-all"
              style={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.06) 100%) 1",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && releases.length === 0 && (
          <div className="p-8 text-center"
            style={{
              borderTop: "1px solid transparent",
              borderBottom: "1px solid transparent",
              borderImage: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent 100%) 1",
            }}
          >
            <p className="text-[#8A8A90]">No releases found.</p>
          </div>
        )}

        {/* Mobile version strip */}
        {!isLoading && !error && releases.length > 0 && (
          <VersionStrip
            releases={releases}
            selectedTag={effectiveSelectedTag}
            onSelect={handleVersionSelect}
          />
        )}

        {/* Content grid */}
        {!isLoading && !error && releases.length > 0 && (
          <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
            {/* Left panel — version index (desktop only) */}
            <aside className="hidden lg:block lg:sticky lg:top-28 space-y-4">
              <div className="relative p-4"
                style={{
                  borderTop: "1px solid transparent",
                  borderBottom: "1px solid transparent",
                  borderImage: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-label text-[#6A6A70]">Version History</span>
                  <span className="text-xs font-mono text-[#6A6A70]">
                    {releases.length}
                  </span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  <VersionList
                    releases={releases}
                    selectedTag={effectiveSelectedTag}
                    onSelect={setSelectedTag}
                  />
                </div>
              </div>
            </aside>

            {/* Right panel — release detail */}
            <section ref={detailRef} className="min-w-0">
              <AnimatePresence mode="wait">
                {selectedRelease ? (
                  <ReleaseDetail
                    key={selectedRelease.id}
                    release={selectedRelease}
                    repo={activeRepo}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 text-center"
                    style={{
                      borderTop: "1px solid transparent",
                      borderBottom: "1px solid transparent",
                      borderImage: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, transparent 100%) 1",
                    }}
                  >
                    <p className="text-[#8A8A90]">
                      Select a version from the timeline to view its release notes.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
