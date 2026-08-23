import { useMemo } from "react"
import AcidSquares from "@/components/AcidSquares"
import { useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

// ponytail: derive a tint from any hex — amt in [-255,255]
function shade(hex: string, amt: number) {
  const n = parseInt(hex.replace("#", ""), 16)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp(((n >> 16) & 255) + amt)
  const g = clamp(((n >> 8) & 255) + amt)
  const b = clamp((n & 255) + amt)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

export function PlasmaWave() {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)
  const accent = useMossStore((s) => s.getAccentHex())

  const plasmaColors = useMemo(
    () => [shade(accent, 30), accent, shade(accent, 90)],
    [accent],
  )

  if (isMobile || performanceMode || reducedMotion) return null

  return (
    <div
      className="absolute top-0 left-0 right-0 z-0 h-[55vh] overflow-hidden pointer-events-none"
      aria-hidden
    >
      <AcidSquares
        detail="medium"
        speed={0.18}
        opacity={0.75}
        mouseInteraction={false}
        color1={plasmaColors[0]}
        color2={plasmaColors[1]}
        color3={plasmaColors[2]}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,11,0.05) 0%, rgba(10,10,11,0.5) 60%, #0A0A0B 100%)",
        }}
      />
    </div>
  )
}
