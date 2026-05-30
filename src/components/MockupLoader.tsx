import { useState, useMemo, useEffect } from "react"

interface MiniCircleData {
  cx: number
  cy: number
  r: number
  id: number
}

const circles: MiniCircleData[] = [
  { cx: 100, cy: 60, r: 8, id: 1 },
  { cx: 50, cy: 110, r: 8, id: 2 },
  { cx: 150, cy: 110, r: 8, id: 3 },
  { cx: 100, cy: 160, r: 8, id: 4 },
  { cx: 50, cy: 210, r: 8, id: 5 },
  { cx: 150, cy: 210, r: 8, id: 6 },
  { cx: 100, cy: 260, r: 8, id: 7 },
  { cx: 50, cy: 310, r: 8, id: 8 },
  { cx: 150, cy: 310, r: 8, id: 9 },
  { cx: 100, cy: 360, r: 8, id: 10 },
]

const blinkKeyframes = `
@keyframes lm-mockup-blink {
  0%, 100% { opacity: 1; }
  25%      { opacity: 0.15; }
  50%      { opacity: 1; }
  75%      { opacity: 0.15; }
}
`

export function MockupLoader() {
  const [ready, setReady] = useState(false)

  const sortedCircles = useMemo(() => {
    const minY = Math.min(...circles.map((c) => c.cy))
    const maxY = Math.max(...circles.map((c) => c.cy))
    const range = maxY - minY

    return circles.map((c) => {
      const normalized = (c.cy - minY) / range
      const delay = (1 - normalized) * 350
      return { ...c, delay: Math.round(delay) }
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 30)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full max-w-[220px] aspect-[9/19.5] rounded-[2px] border border-[rgba(255,255,255,0.12)] overflow-hidden bg-[#111113] flex items-center justify-center">
      <style>{blinkKeyframes}</style>
      <div
        className="w-[80px] h-[140px]"
        style={{ animation: "lm-mockup-blink 800ms ease-in-out infinite" }}
      >
        <svg
          viewBox="0 0 200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 20px rgba(160,160,160,0.1))" }}
        >
          <defs>
            <radialGradient id="ml-metallic" cx="35%" cy="30%" r="65%" fx="30%" fy="25%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="15%" stopColor="#E8E8E8" />
              <stop offset="40%" stopColor="#A0A0A0" />
              <stop offset="60%" stopColor="#707070" />
              <stop offset="80%" stopColor="#B0B0B0" />
              <stop offset="100%" stopColor="#505050" />
            </radialGradient>
          </defs>

          {sortedCircles.map((circle) => (
            <circle
              key={circle.id}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="url(#ml-metallic)"
              style={{
                opacity: ready ? 1 : 0,
                transition: `opacity 250ms ease-out ${circle.delay}ms`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
