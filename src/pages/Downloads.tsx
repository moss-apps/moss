import { useMemo } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, AlertCircle, Loader2, Download, Tag } from "lucide-react"
import { useGitHubReleases, type GitHubRelease } from "@/hooks/useGitHubReleases"

type Repo = "Latch" | "Flick"

const REPO_META: Record<Repo, { label: string; logo: string; color: string; githubUrl: string }> = {
  Latch: {
    label: "Latch",
    logo: "/assets/logos/latch_logo.svg",
    color: "#4F8CFF",
    githubUrl: "https://github.com/moss-apps/Latch/releases",
  },
  Flick: {
    label: "Flick",
    logo: "/assets/logos/flick_logo.svg",
    color: "#14B8A6",
    githubUrl: "https://github.com/moss-apps/Flick/releases",
  },
}

interface SeriesPoint {
  date: number
  value: number
}

interface Series {
  points: SeriesPoint[]
  total: number
}

function buildSeries(releases: GitHubRelease[]): Series {
  const sorted = [...releases].sort(
    (a, b) =>
      new Date(a.published_at).getTime() - new Date(b.published_at).getTime(),
  )

  let cum = 0
  const points: SeriesPoint[] = sorted.map((r) => {
    const dl = r.assets.reduce((s, a) => s + a.download_count, 0)
    cum += dl
    return { date: new Date(r.published_at).getTime(), value: cum }
  })

  const total = sorted.reduce(
    (s, r) => s + r.assets.reduce((x, a) => x + a.download_count, 0),
    0,
  )

  return { points, total }
}

function formatCompact(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k"
  return String(n)
}

function formatFull(n: number): string {
  return n.toLocaleString()
}

function formatDateShort(t: number): string {
  return new Date(t).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  })
}

const CHART = {
  W: 800,
  H: 340,
  padL: 52,
  padR: 24,
  padT: 28,
  padB: 40,
}

function CumulativeChart({ latches, flicks }: { latches: Series; flicks: Series }) {
  const { W, H, padL, padR, padT, padB } = CHART
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const allDates = [...latches.points, ...flicks.points].map((p) => p.date)
  const minDate = allDates.length ? Math.min(...allDates) : 0
  const maxDate = allDates.length ? Math.max(...allDates) : 1
  const dateSpan = maxDate - minDate || 1
  const maxValue = Math.max(
    latches.points.at(-1)?.value ?? 0,
    flicks.points.at(-1)?.value ?? 0,
    1,
  )

  const xScale = (d: number) => padL + ((d - minDate) / dateSpan) * plotW
  const yScale = (v: number) => padT + plotH - (v / maxValue) * plotH

  const linePath = (points: SeriesPoint[]) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.date)} ${yScale(p.value)}`)
      .join(" ")

  const areaPath = (points: SeriesPoint[]) => {
    if (!points.length) return ""
    const first = points[0]
    const last = points.at(-1)!
    const baseline = padT + plotH
    return `M ${xScale(first.date)} ${baseline} ${points
      .map((p) => `L ${xScale(p.date)} ${yScale(p.value)}`)
      .join(" ")} L ${xScale(last.date)} ${baseline} Z`
  }

  const series = [
    { key: "Latch" as Repo, data: latches },
    { key: "Flick" as Repo, data: flicks },
  ]

  // Y axis ticks: 4 steps
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    value: Math.round(maxValue * f),
    y: yScale(maxValue * f),
  }))

  // X axis ticks: 5 evenly spaced dates
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    date: minDate + dateSpan * f,
    x: padL + f * plotW,
  }))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Cumulative downloads over time for Latch and Flick"
    >
      <defs>
        {series.map((s) => {
          const color = REPO_META[s.key].color
          return (
            <linearGradient
              key={s.key}
              id={`grad-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          )
        })}
      </defs>

      {/* gridlines + y labels */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={padL}
            x2={W - padR}
            y1={t.y}
            y2={t.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
          <text
            x={padL - 10}
            y={t.y + 4}
            textAnchor="end"
            className="fill-[#6A6A70]"
            style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)" }}
          >
            {formatCompact(t.value)}
          </text>
        </g>
      ))}

      {/* x labels */}
      {xTicks.map((t, i) => (
        <text
          key={i}
          x={t.x}
          y={H - padB + 22}
          textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
          className="fill-[#6A6A70]"
          style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)" }}
        >
          {formatDateShort(t.date)}
        </text>
      ))}

      {/* areas */}
      {series.map((s) =>
        s.data.points.length > 1 ? (
          <motion.path
            key={`area-${s.key}`}
            d={areaPath(s.data.points)}
            fill={`url(#grad-${s.key})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        ) : null,
      )}

      {/* lines */}
      {series.map((s, idx) =>
        s.data.points.length > 0 ? (
          <motion.path
            key={`line-${s.key}`}
            d={linePath(s.data.points)}
            fill="none"
            stroke={REPO_META[s.key].color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.1 + idx * 0.15, ease: "easeInOut" }}
          />
        ) : null,
      )}

      {/* endpoint markers */}
      {series.map((s) => {
        const last = s.data.points.at(-1)
        if (!last) return null
        return (
          <g key={`end-${s.key}`}>
            <circle
              cx={xScale(last.date)}
              cy={yScale(last.value)}
              r={4}
              fill={REPO_META[s.key].color}
              stroke="#0a0a0a"
              strokeWidth={2}
            />
          </g>
        )
      })}
    </svg>
  )
}

function StatCard({
  repo,
  series,
  releaseCount,
  latestTag,
}: {
  repo: Repo
  series: Series
  releaseCount: number
  latestTag: string | null
}) {
  const meta = REPO_META[repo]
  return (
    <div className="glass brutal-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <img src={meta.logo} alt="" className="w-8 h-8" />
        <span className="font-display text-lg font-medium text-[#F5F5F5]">
          {meta.label}
        </span>
        <span
          className="ml-auto h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#F5F5F5] tabular-nums">
          {formatFull(series.total)}
        </span>
        <span className="text-sm text-[#6A6A70]">downloads</span>
      </div>
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-5 text-xs text-[#8A8A90]">
        <span className="inline-flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          {releaseCount} releases
        </span>
        {latestTag && (
          <span className="font-mono text-[#8A8A90]">{latestTag}</span>
        )}
      </div>
    </div>
  )
}

export function Downloads() {
  const latch = useGitHubReleases("Latch")
  const flick = useGitHubReleases("Flick")

  const latchSeries = useMemo(() => buildSeries(latch.releases), [latch.releases])
  const flickSeries = useMemo(() => buildSeries(flick.releases), [flick.releases])

  const isLoading = latch.isLoading || flick.isLoading
  const error = latch.error || flick.error
  const hasData =
    latch.releases.length > 0 || flick.releases.length > 0

  const combinedTotal = latchSeries.total + flickSeries.total

  return (
    <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moss
        </Link>

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#F5F5F5]">
              Downloads
            </h1>
          </div>
          <p className="text-[#8A8A90] max-w-xl leading-relaxed">
            All-time cumulative downloads across Latch and Flick release assets —
            pulled live from GitHub, summed across every version.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            <p className="text-sm text-[#8A8A90]">Tallying downloads…</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="glass brutal-border rounded-2xl p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-xl text-[#F5F5F5] mb-2">
              Couldn&apos;t load download stats
            </h2>
            <p className="text-sm text-[#8A8A90] max-w-md mx-auto mb-6">
              GitHub&apos;s API rate limit may have been reached, or the network
              is unavailable. Try again in a moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-full border border-white/10 text-sm text-[#8A8A90] hover:text-[#F5F5F5] hover:border-white/20 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && hasData && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <StatCard
                repo="Latch"
                series={latchSeries}
                releaseCount={latch.releases.length}
                latestTag={latch.releases[0]?.tag_name ?? null}
              />
              <StatCard
                repo="Flick"
                series={flickSeries}
                releaseCount={flick.releases.length}
                latestTag={flick.releases[0]?.tag_name ?? null}
              />
            </div>

            {/* Chart */}
            <div className="glass brutal-border rounded-2xl p-5 sm:p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#8A8A90]" />
                  <span className="text-label text-[#6A6A70]">
                    Cumulative Downloads
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  {(Object.keys(REPO_META) as Repo[]).map((repo) => (
                    <span
                      key={repo}
                      className="inline-flex items-center gap-2 text-xs text-[#8A8A90]"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: REPO_META[repo].color }}
                      />
                      {REPO_META[repo].label}
                    </span>
                  ))}
                </div>
              </div>

              <CumulativeChart latches={latchSeries} flicks={flickSeries} />

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs text-[#6A6A70] max-w-lg leading-relaxed">
                  Cumulative sum of asset downloads across all releases, plotted
                  by release date. The curve steps up with each release.
                </p>
                <span className="text-sm text-[#8A8A90] font-mono">
                  {formatFull(combinedTotal)} total
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && !hasData && (
          <div className="glass brutal-border rounded-2xl p-8 text-center">
            <p className="text-[#8A8A90]">No release data available.</p>
          </div>
        )}
      </div>
    </main>
  )
}
