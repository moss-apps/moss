import { useEffect, useState, useMemo } from "react"

interface CircleData {
  cx: number
  cy: number
  r: number
  transform: string
  fill: string
  id: number
}

const circleData: CircleData[] = [
  { cx: 204.449, cy: 318.293, r: 24.0672, transform: "rotate(45 204.449 318.293)", fill: "url(#metallic)", id: 1 },
  { cx: 147.722, cy: 375.02, r: 24.0672, transform: "rotate(45 147.722 375.02)", fill: "url(#metallic-warm)", id: 2 },
  { cx: 375.706, cy: 147.627, r: 24.0672, transform: "rotate(45 375.706 147.627)", fill: "url(#metallic)", id: 3 },
  { cx: 318.979, cy: 204.354, r: 24.0672, transform: "rotate(45 318.979 204.354)", fill: "url(#metallic-warm)", id: 4 },
  { cx: 375.958, cy: 260.699, r: 24.0672, transform: "rotate(45 375.958 260.699)", fill: "url(#metallic)", id: 5 },
  { cx: 319.231, cy: 317.426, r: 24.0672, transform: "rotate(45 319.231 317.426)", fill: "url(#metallic-warm)", id: 6 },
  { cx: 262.504, cy: 374.153, r: 24.0672, transform: "rotate(45 262.504 374.153)", fill: "url(#metallic)", id: 7 },
  { cx: 262.432, cy: 147.173, r: 24.0672, transform: "rotate(45 262.432 147.173)", fill: "url(#metallic-warm)", id: 8 },
  { cx: 148.978, cy: 260.627, r: 24.0672, transform: "rotate(45 148.978 260.627)", fill: "url(#metallic)", id: 9 },
  { cx: 489.096, cy: 147.564, r: 24.0672, transform: "rotate(-45 489.096 147.564)", fill: "url(#metallic-warm)", id: 10 },
  { cx: 545.823, cy: 204.291, r: 24.0672, transform: "rotate(-45 545.823 204.291)", fill: "url(#metallic)", id: 11 },
  { cx: 602.55, cy: 261.017, r: 24.0672, transform: "rotate(-45 602.55 261.017)", fill: "url(#metallic-warm)", id: 12 },
  { cx: 489.096, cy: 147.564, r: 24.0672, transform: "rotate(-45 489.096 147.564)", fill: "url(#metallic)", id: 13 },
  { cx: 545.823, cy: 204.291, r: 24.0672, transform: "rotate(-45 545.823 204.291)", fill: "url(#metallic-warm)", id: 14 },
  { cx: 602.55, cy: 261.017, r: 24.0672, transform: "rotate(-45 602.55 261.017)", fill: "url(#metallic)", id: 15 },
  { cx: 489.096, cy: 147.564, r: 24.0672, transform: "rotate(-45 489.096 147.564)", fill: "url(#metallic-warm)", id: 16 },
  { cx: 545.823, cy: 204.291, r: 24.0672, transform: "rotate(-45 545.823 204.291)", fill: "url(#metallic)", id: 17 },
  { cx: 602.55, cy: 261.017, r: 24.0672, transform: "rotate(-45 602.55 261.017)", fill: "url(#metallic-warm)", id: 18 },
  { cx: 147.564, cy: 489.096, r: 24.0672, transform: "rotate(-45 147.564 489.096)", fill: "url(#metallic)", id: 19 },
  { cx: 204.291, cy: 545.823, r: 24.0672, transform: "rotate(-45 204.291 545.823)", fill: "url(#metallic-warm)", id: 20 },
  { cx: 261.017, cy: 602.55, r: 24.0672, transform: "rotate(-45 261.017 602.55)", fill: "url(#metallic)", id: 21 },
  { cx: 148.036, cy: 148.036, r: 24.0672, transform: "rotate(45 148.036 148.036)", fill: "url(#metallic-warm)", id: 22 },
  { cx: 841.036, cy: 841.036, r: 24.0672, transform: "rotate(45 841.036 841.036)", fill: "url(#metallic)", id: 23 },
  { cx: 295.036, cy: 694.036, r: 24.0672, transform: "rotate(45 295.036 694.036)", fill: "url(#metallic-warm)", id: 24 },
  { cx: 693.036, cy: 295.036, r: 24.0672, transform: "rotate(45 693.036 295.036)", fill: "url(#metallic)", id: 25 },
  { cx: 785.137, cy: 670.293, r: 24.0672, transform: "rotate(-135 785.137 670.293)", fill: "url(#metallic-warm)", id: 26 },
  { cx: 841.864, cy: 613.566, r: 24.0672, transform: "rotate(-135 841.864 613.566)", fill: "url(#metallic)", id: 27 },
  { cx: 613.88, cy: 840.959, r: 24.0672, transform: "rotate(-135 613.88 840.959)", fill: "url(#metallic-warm)", id: 28 },
  { cx: 670.607, cy: 784.232, r: 24.0672, transform: "rotate(-135 670.607 784.232)", fill: "url(#metallic)", id: 29 },
  { cx: 727.154, cy: 841.413, r: 24.0672, transform: "rotate(-135 727.154 841.413)", fill: "url(#metallic-warm)", id: 30 },
  { cx: 840.608, cy: 727.959, r: 24.0672, transform: "rotate(-135 840.608 727.959)", fill: "url(#metallic)", id: 31 },
  { cx: 500.49, cy: 841.022, r: 24.0672, transform: "rotate(135 500.49 841.022)", fill: "url(#metallic-warm)", id: 32 },
  { cx: 443.763, cy: 784.295, r: 24.0672, transform: "rotate(135 443.763 784.295)", fill: "url(#metallic)", id: 33 },
  { cx: 387.036, cy: 727.569, r: 24.0672, transform: "rotate(135 387.036 727.569)", fill: "url(#metallic-warm)", id: 34 },
  { cx: 842.022, cy: 499.49, r: 24.0672, transform: "rotate(135 842.022 499.49)", fill: "url(#metallic)", id: 35 },
  { cx: 785.296, cy: 442.763, r: 24.0672, transform: "rotate(135 785.296 442.763)", fill: "url(#metallic-warm)", id: 36 },
  { cx: 728.569, cy: 386.036, r: 24.0672, transform: "rotate(135 728.569 386.036)", fill: "url(#metallic)", id: 37 },
  { cx: 500.763, cy: 726.763, r: 24.0672, transform: "rotate(-45 500.763 726.763)", fill: "url(#metallic-warm)", id: 38 },
  { cx: 557.49, cy: 783.49, r: 24.0672, transform: "rotate(-45 557.49 783.49)", fill: "url(#metallic)", id: 39 },
  { cx: 726.763, cy: 500.763, r: 24.0672, transform: "rotate(-45 726.763 500.763)", fill: "url(#metallic-warm)", id: 40 },
  { cx: 783.49, cy: 557.49, r: 24.0672, transform: "rotate(-45 783.49 557.49)", fill: "url(#metallic)", id: 41 },
  { cx: 670.036, cy: 670.036, r: 24.0672, transform: "rotate(-45 670.036 670.036)", fill: "url(#metallic-warm)", id: 42 },
  { cx: 319.036, cy: 433.036, r: 24.0672, transform: "rotate(-45 319.036 433.036)", fill: "url(#metallic)", id: 43 },
  { cx: 375.763, cy: 489.763, r: 24.0672, transform: "rotate(-45 375.763 489.763)", fill: "url(#metallic-warm)", id: 44 },
  { cx: 432.036, cy: 308.036, r: 24.0672, transform: "rotate(-45 432.036 308.036)", fill: "url(#metallic)", id: 45 },
  { cx: 488.763, cy: 364.763, r: 24.0672, transform: "rotate(-45 488.763 364.763)", fill: "url(#metallic-warm)", id: 46 },
]

const blinkKeyframes = `
@keyframes lm-blink {
  0%, 100%   { opacity: 1; }
  12.5%      { opacity: 0.12; }
  25%        { opacity: 1; }
  37.5%      { opacity: 0.12; }
  50%        { opacity: 1; }
}
`

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"entering" | "blinking" | "exiting" | "done">("entering")
  const [circlesReady, setCirclesReady] = useState(false)
  const [minElapsed, setMinElapsed] = useState(false)
  const [siteReady, setSiteReady] = useState(false)

  const sortedCircles = useMemo(() => {
    const minY = Math.min(...circleData.map((c) => c.cy))
    const maxY = Math.max(...circleData.map((c) => c.cy))
    const range = maxY - minY

    return circleData.map((c) => {
      const normalized = (c.cy - minY) / range
      const delay = (1 - normalized) * 450
      return { ...c, delay: Math.round(delay) }
    })
  }, [])

  useEffect(() => {
    const readyTimer = setTimeout(() => setCirclesReady(true), 50)
    const blinkTimer = setTimeout(() => setPhase("blinking"), 700)
    const minTimer = setTimeout(() => setMinElapsed(true), 1350)
    return () => {
      clearTimeout(readyTimer)
      clearTimeout(blinkTimer)
      clearTimeout(minTimer)
    }
  }, [])

  useEffect(() => {
    if (siteReady) return
    let cancelled = false
    const settle = () => {
      if (!cancelled) setSiteReady(true)
    }
    const loaded =
      document.readyState === "complete" &&
      (!document.fonts || document.fonts.status === "loaded")
    if (loaded) {
      settle()
      return
    }
    if (document.readyState !== "complete") {
      window.addEventListener("load", settle, { once: true })
    }
    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(settle)
    }
    return () => {
      cancelled = true
      window.removeEventListener("load", settle)
    }
  }, [siteReady])

  useEffect(() => {
    if (!(siteReady && minElapsed)) return
    // ponytail: exit only once the site is actually loaded (window load + fonts) AND the
    // 1350ms blink floor has played. Slow site → hold; fast site → exit at the floor.
    const exitTimer = setTimeout(() => setPhase("exiting"), 0)
    const doneTimer = setTimeout(() => {
      setPhase("done")
      onComplete()
    }, 500)
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [siteReady, minElapsed, onComplete])

  if (phase === "done") return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0B] transition-opacity duration-500 ease-out ${
        phase === "exiting" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <style>{blinkKeyframes}</style>
      <div
        className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]"
        style={
          phase === "blinking"
            ? { animation: "lm-blink 650ms ease-in-out" }
            : undefined
        }
      >
        <svg
          viewBox="0 0 990 989"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 40px rgba(160,160,160,0.15))" }}
        >
          <defs>
            <radialGradient id="metallic" cx="35%" cy="30%" r="65%" fx="30%" fy="25%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="15%" stopColor="#E8E8E8" />
              <stop offset="40%" stopColor="#A0A0A0" />
              <stop offset="60%" stopColor="#707070" />
              <stop offset="80%" stopColor="#B0B0B0" />
              <stop offset="100%" stopColor="#505050" />
            </radialGradient>
            <radialGradient id="metallic-warm" cx="35%" cy="30%" r="65%" fx="30%" fy="25%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="15%" stopColor="#EBE5DF" />
              <stop offset="40%" stopColor="#A89888" />
              <stop offset="60%" stopColor="#706050" />
              <stop offset="80%" stopColor="#B0A090" />
              <stop offset="100%" stopColor="#504030" />
            </radialGradient>
          </defs>

          {sortedCircles.map((circle) => (
            <circle
              key={circle.id}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              transform={circle.transform}
              fill={circle.fill}
              style={{
                opacity: circlesReady ? 1 : 0,
                transition: `opacity 300ms ease-out ${circle.delay}ms`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
