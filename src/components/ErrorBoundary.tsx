import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0A0B]">
        <div
          className="w-full max-w-lg p-8 text-center"
          style={{
            borderTop: "1px solid transparent",
            borderBottom: "1px solid transparent",
            borderImage:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-label mb-3">Error 500</p>
          <h1 className="font-display text-2xl font-medium tracking-tight text-[#F5F5F5] mb-3">
            Something broke on our end
          </h1>
          <p className="text-sm text-[#8A8A90] leading-relaxed mb-8">
            An unexpected error stopped this page from rendering. Reloading
            usually clears it. If it keeps happening, let us know.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[var(--accent)] text-[#0A0A0B] hover:brightness-110 transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </button>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors rounded-md border border-white/10 hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
    )
  }
}
