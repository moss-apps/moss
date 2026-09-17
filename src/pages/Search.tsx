import { useMemo, type ReactNode } from "react"
import { Link, useSearchParams } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  GitCommit,
  Megaphone,
  Search as SearchIcon,
  X,
} from "lucide-react"
import { PlasmaWave } from "@/components/PlasmaWave"
import { DOCS } from "@/lib/docs"
import { useAnnouncements } from "@/hooks/useAnnouncements"
import { useGitHubReleases } from "@/hooks/useGitHubReleases"
import { formatDate, panelStyle } from "@/lib/announcements"

type Source = "Community" | "Announcements" | "Changelog"

interface SearchResult {
  id: string
  source: Source
  title: string
  snippet: string
  href: string
  external?: boolean
  meta: string
}

const SOURCE_ICONS: Record<Source, typeof FileText> = {
  Community: FileText,
  Announcements: Megaphone,
  Changelog: GitCommit,
}

const SUGGESTIONS = [
  {
    icon: Megaphone,
    title: "Announcements",
    description: "News and updates across the ecosystem.",
    href: "/announcements",
  },
  {
    icon: GitCommit,
    title: "Changelog",
    description: "Release notes for Flick and Latch.",
    href: "/changelog",
  },
  {
    icon: FileText,
    title: "Community docs",
    description: "Readme, privacy, terms, and license.",
    href: "/community",
  },
]

function plain(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[#>\-*+]+\s+/gm, " ")
    .replace(/[*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function makeSnippet(text: string, query: string, radius = 100): string {
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) {
    return text.length > radius * 2
      ? text.slice(0, radius * 2).trimEnd() + "…"
      : text
  }
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + query.length + radius)
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`
}

function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  if (!query) return text
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "ig"))
  const needle = query.toLowerCase()
  return parts.map((part, index) =>
    part.toLowerCase() === needle ? (
      <mark
        key={index}
        className="bg-[var(--accent)]/25 text-[#F5F5F5] rounded-[2px]"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function ResultRow({ result, query }: { result: SearchResult; query: string }) {
  const Icon = SOURCE_ICONS[result.source]
  const inner = (
    <>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
          {result.source}
        </span>
        <span className="text-xs text-[#6A6A70]">{result.meta}</span>
        {result.external && (
          <ExternalLink className="w-3 h-3 text-[#6A6A70] ml-auto" />
        )}
      </div>
      <p className="text-sm font-medium text-[#F5F5F5] mb-1">
        <Highlight text={result.title} query={query} />
      </p>
      <p className="text-xs text-[#8A8A90] leading-relaxed line-clamp-2">
        <Highlight text={result.snippet} query={query} />
      </p>
    </>
  )

  const className =
    "group block p-4 border border-white/10 hover:border-[var(--accent)]/40 transition-colors"

  if (result.external) {
    return (
      <a href={result.href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }
  return (
    <Link to={result.href} className={className}>
      {inner}
    </Link>
  )
}

export function Search() {
  const [params, setParams] = useSearchParams()
  const query = params.get("q")?.trim() ?? ""

  const { items: announcements, isLoading: announcementsLoading } = useAnnouncements()
  const { releases: latchReleases, isLoading: latchLoading } = useGitHubReleases("Latch")
  const { releases: flickReleases, isLoading: flickLoading } = useGitHubReleases("Flick")

  const loading = announcementsLoading || latchLoading || flickLoading

  const groups = useMemo(() => {
    if (!query) return []
    const needle = query.toLowerCase()
    const matches = (text: string) => text.toLowerCase().includes(needle)

    const docs: SearchResult[] = DOCS.filter(
      (doc) => matches(doc.label) || matches(doc.raw),
    ).map((doc) => {
      const text = plain(doc.raw)
      return {
        id: `doc-${doc.slug}`,
        source: "Community",
        title: doc.label,
        snippet: makeSnippet(text, query),
        href: `/community/${doc.slug}`,
        meta: "Community document",
      }
    })

    const news: SearchResult[] = announcements
      .filter((item) => matches(item.title) || matches(item.body))
      .map((item) => ({
        id: `announcement-${item.id}`,
        source: "Announcements",
        title: item.title,
        snippet: makeSnippet(plain(item.body), query),
        href: `/announcements/${item.id}`,
        meta: formatDate(item.date),
      }))

    const releases: SearchResult[] = [...latchReleases, ...flickReleases]
      .filter(
        (release) =>
          matches(release.tag_name) ||
          matches(release.name ?? "") ||
          matches(release.body ?? ""),
      )
      .map((release) => ({
        id: `release-${release.id}`,
        source: "Changelog",
        title: `${release.tag_name} — ${release.name?.trim() || "Release"}`,
        snippet: makeSnippet(plain(release.body ?? ""), query),
        href: release.html_url,
        external: true,
        meta: formatDate(release.published_at),
      }))

    return (
      [
        { source: "Announcements" as const, results: news },
        { source: "Changelog" as const, results: releases },
        { source: "Community" as const, results: docs },
      ] as const
    )
      .filter((group) => group.results.length > 0)
      .map((group) => ({
        ...group,
        total: group.results.length,
        results: group.results.slice(0, 10),
      }))
  }, [query, announcements, latchReleases, flickReleases])

  const totalResults = groups.reduce((sum, group) => sum + group.total, 0)

  const updateQuery = (value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set("q", value)
    else next.delete("q")
    setParams(next, { replace: true })
  }

  return (
    <main className="relative min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 bg-[#0A0A0B]">
      <title>Search — Moss Laboratories</title>
      <meta name="description" content="Search announcements, changelogs, and community documents." />
      <meta name="robots" content="noindex, follow" />
      <PlasmaWave />

      <div className="relative z-10 max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moss
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <SearchIcon className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#F5F5F5]">
              Search
            </h1>
          </div>
          <p className="text-[#8A8A90] max-w-xl leading-relaxed">
            Across announcements, release notes, and every community document.
          </p>
        </div>

        {/* Input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6A70] pointer-events-none" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search the ecosystem…"
            aria-label="Search the site"
            className="w-full pl-11 pr-11 py-3.5 bg-white/[0.02] text-[#F5F5F5] text-sm border border-white/10 focus:border-[var(--accent)]/40 focus:outline-none transition-colors rounded-none placeholder:text-[#5A5A60]"
          />
          {query && (
            <button
              onClick={() => updateQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6A6A70] hover:text-[#F5F5F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Empty query — suggestions */}
        {!query && (
          <div className="grid sm:grid-cols-3 gap-3">
            {SUGGESTIONS.map((suggestion) => (
              <Link
                key={suggestion.href}
                to={suggestion.href}
                className="group p-4 border border-white/10 hover:border-[var(--accent)]/40 transition-colors"
              >
                <suggestion.icon className="w-4 h-4 text-[var(--accent)] mb-3" />
                <p className="text-sm text-[#F5F5F5] mb-1">{suggestion.title}</p>
                <p className="text-xs text-[#6A6A70] leading-relaxed">
                  {suggestion.description}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Results */}
        {query && (
          <div>
            <div
              className="flex items-center justify-between pb-4 mb-6"
              style={{
                borderBottom: "1px solid transparent",
                borderImage:
                  "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.06) 100%) 1",
              }}
            >
              <span className="font-mono text-xs text-[#8A8A90]">
                {loading && totalResults === 0
                  ? "Searching…"
                  : `${totalResults} result${totalResults === 1 ? "" : "s"}`}
              </span>
              <span className="font-mono text-xs text-[#6A6A70]">
                &ldquo;{query}&rdquo;
              </span>
            </div>

            {!loading && totalResults === 0 && (
              <div className="p-8 text-center" style={panelStyle}>
                <p className="text-sm text-[#8A8A90] mb-1">
                  No matches for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-[#6A6A70]">
                  Try a version number, a feature name, or a document title.
                </p>
              </div>
            )}

            <div className="space-y-8">
              {groups.map((group) => (
                <motion.section
                  key={group.source}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {(() => {
                      const Icon = SOURCE_ICONS[group.source]
                      return <Icon className="w-4 h-4 text-[#8A8A90]" />
                    })()}
                    <h2 className="text-label">{group.source}</h2>
                    <span className="font-mono text-xs text-[#6A6A70]">
                      {group.total}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {group.results.map((result) => (
                      <li key={result.id}>
                        <ResultRow result={result} query={query} />
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
