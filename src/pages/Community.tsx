import { useMemo } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { ArrowLeft, FileText } from "lucide-react"

import codeOfConductRaw from "../../CODE_OF_CONDUCT.md?raw"
import contributingRaw from "../../CONTRIBUTING.md?raw"
import licenseRaw from "../../LICENSE?raw"
import privacyRaw from "../../PRIVACY.md?raw"
import readmeRaw from "../../README.md?raw"
import securityRaw from "../../SECURITY.md?raw"
import termsRaw from "../../TERMS.md?raw"

type Slug =
  | "readme"
  | "contributing"
  | "code-of-conduct"
  | "security"
  | "privacy"
  | "terms"
  | "license"

interface Doc {
  slug: Slug
  label: string
  raw: string
}

const DOCS: Doc[] = [
  { slug: "readme", label: "Readme", raw: readmeRaw },
  { slug: "contributing", label: "Contributing", raw: contributingRaw },
  { slug: "code-of-conduct", label: "Code of Conduct", raw: codeOfConductRaw },
  { slug: "security", label: "Security", raw: securityRaw },
  { slug: "privacy", label: "Privacy", raw: privacyRaw },
  { slug: "terms", label: "Terms", raw: termsRaw },
  { slug: "license", label: "License", raw: licenseRaw },
]

const FILE_TO_SLUG: Record<string, Slug> = {
  readme: "readme",
  contributing: "contributing",
  code_of_conduct: "code-of-conduct",
  codeofconduct: "code-of-conduct",
  security: "security",
  privacy: "privacy",
  terms: "terms",
  license: "license",
}

function resolveInternal(href: string): Slug | null {
  const match = href.match(/^[./\s]*([A-Za-z0-9_-]+?)(?:\.md)?$/)
  if (!match) return null
  const key = match[1].toLowerCase().replace(/-/g, "_")
  return FILE_TO_SLUG[key] ?? null
}

const panelStyle = {
  borderTop: "1px solid transparent",
  borderBottom: "1px solid transparent",
  borderImage:
    "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
} as const

export function Community() {
  const params = useParams<{ slug?: string }>()
  const navigate = useNavigate()

  const slug = (params.slug as Slug | undefined) ?? "readme"
  const active = useMemo(
    () => DOCS.find((d) => d.slug === slug) ?? DOCS[0],
    [slug],
  )
  const activeIndex = DOCS.findIndex((d) => d.slug === active.slug)

  return (
    <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen">
      <title>Community — Moss Laboratories</title>
      <meta
        name="description"
        content="Moss Laboratories community documents — Readme, Contributing, Code of Conduct, Security, Privacy, Terms, and License."
      />
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moss
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#F5F5F5]">
              Community
            </h1>
          </div>
          <p className="text-[#8A8A90] max-w-xl leading-relaxed">
            The documents that govern the Moss Laboratories ecosystem — its
            code, conduct, security, and legal terms.
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Index (desktop) */}
          <aside className="hidden lg:block lg:sticky lg:top-28">
            <div
              className="relative p-4"
              style={{
                ...panelStyle,
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-label text-[#6A6A70]">Documents</span>
                <span className="text-xs font-mono text-[#6A6A70]">
                  {DOCS.length}
                </span>
              </div>
              <div className="space-y-1">
                {DOCS.map((doc, i) => {
                  const isActive = doc.slug === active.slug
                  return (
                    <button
                      key={doc.slug}
                      onClick={() => navigate(`/community/${doc.slug}`)}
                      className={`w-full text-left px-3 py-2.5 transition-all ${
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[#F5F5F5] hover:text-[#F5F5F5]"
                      }`}
                      style={{
                        borderBottom:
                          i === DOCS.length - 1
                            ? undefined
                            : "1px solid transparent",
                        borderImage: isActive
                          ? "linear-gradient(to right, transparent 0%, var(--accent)40 20%, var(--accent)40 80%, transparent 100%) 1"
                          : "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 100%) 1",
                      }}
                    >
                      <span className="font-mono text-sm">{doc.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Mobile horizontal strip */}
          <div className="lg:hidden -mx-4 px-4 mb-4 sm:mb-6">
            <div
              className="overflow-x-auto py-2 custom-scrollbar"
              style={panelStyle}
            >
              <div className="flex gap-2 px-1">
                {DOCS.map((doc) => {
                  const isActive = doc.slug === active.slug
                  return (
                    <button
                      key={doc.slug}
                      onClick={() => navigate(`/community/${doc.slug}`)}
                      className={`shrink-0 px-3 py-1.5 text-xs font-mono transition-colors ${
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[#8A8A90] hover:text-[#F5F5F5]"
                      }`}
                    >
                      {doc.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <section className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="relative py-6 sm:py-8 px-0 sm:px-8"
                style={{
                  ...panelStyle,
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between pb-6 mb-6"
                  style={{
                    borderBottom: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.06) 100%) 1",
                  }}
                >
                  <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#F5F5F5]">
                    {active.label}
                  </h2>
                  <span className="text-xs font-mono text-[#6A6A70]">
                    {activeIndex + 1}/{DOCS.length}
                  </span>
                </div>

                <div className="changelog-prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      a: ({ href, children, ...rest }) => {
                        if (href) {
                          const internal = resolveInternal(href)
                          if (internal) {
                            return (
                              <Link
                                to={`/community/${internal}`}
                                {...rest}
                              >
                                {children}
                              </Link>
                            )
                          }
                        }
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...rest}
                          >
                            {children}
                          </a>
                        )
                      },
                      img: ({ src, alt, ...rest }) => {
                        let s = String(src ?? "")
                        if (s.startsWith("public/")) s = "/" + s.slice("public/".length)
                        return <img src={s} alt={alt ?? ""} loading="lazy" {...rest} />
                      },
                    }}
                  >
                    {active.raw}
                  </ReactMarkdown>
                </div>

                {/* Prev / next */}
                <div
                  className="mt-10 pt-6 flex items-center justify-between flex-wrap gap-3"
                  style={{
                    borderTop: "1px solid transparent",
                    borderImage:
                      "linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.06) 100%) 1",
                  }}
                >
                  {activeIndex > 0 ? (
                    <button
                      onClick={() =>
                        navigate(`/community/${DOCS[activeIndex - 1].slug}`)
                      }
                      className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[var(--accent)] transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {DOCS[activeIndex - 1].label}
                    </button>
                  ) : (
                    <span />
                  )}
                  {activeIndex < DOCS.length - 1 ? (
                    <button
                      onClick={() =>
                        navigate(`/community/${DOCS[activeIndex + 1].slug}`)
                      }
                      className="inline-flex items-center gap-2 text-sm text-[#8A8A90] hover:text-[var(--accent)] transition-colors"
                    >
                      {DOCS[activeIndex + 1].label}
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  )
}