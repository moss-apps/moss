import { Suspense, lazy } from "react"
import { useMossStore } from "@/stores/useMossStore"

const ShaderBackgroundImpl = lazy(() =>
  import("@/components/ShaderBackground").then((m) => ({
    default: m.ShaderBackground,
  }))
)

function StaticDotGrid() {
  return (
    <div
      className="absolute inset-0 dot-pattern opacity-40"
      aria-hidden="true"
    />
  )
}

export function ShaderBackground() {
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)
  const showShader = !performanceMode && !reducedMotion

  return (
    <div className="fixed inset-0 -z-10">
      {showShader ? (
        <Suspense fallback={<StaticDotGrid />}>
          <ShaderBackgroundImpl />
        </Suspense>
      ) : (
        <StaticDotGrid />
      )}
    </div>
  )
}
