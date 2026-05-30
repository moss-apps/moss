import { useRef, useEffect, useCallback } from "react"
import { useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=-~?/\\|<>[]{}()"

export function AsciiFlashlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)
  const gridRef = useRef<{ char: string; x: number; y: number; brightness: number }[]>([])
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)

  const initGrid = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio, 2)
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const fontSize = 14
    const cols = Math.ceil(width / fontSize)
    const rows = Math.ceil(height / fontSize)

    const grid: { char: string; x: number; y: number; brightness: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          x: c * fontSize + fontSize / 2,
          y: r * fontSize + fontSize / 2,
          brightness: 0,
        })
      }
    }
    gridRef.current = grid

    // Static draw — all characters in background color (invisible)
    ctx.fillStyle = "#0A0A0B"
    ctx.fillRect(0, 0, width, height)
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#0A0A0B"
    for (const cell of grid) {
      ctx.fillText(cell.char, cell.x, cell.y)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || isMobile || performanceMode || reducedMotion) return

    initGrid(canvas)

    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
      }
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("touchmove", handleTouch, { passive: true })

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const fontSize = 14
    const revealRadius = 120
    const maxBrightness = 1
    const decay = 0.03

    let frameCount = 0
    const animate = () => {
      frameCount++
      // Skip frames for performance — render every 2nd frame
      if (frameCount % 2 !== 0) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio, 2)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = "#0A0A0B"
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const cell of gridRef.current) {
        const dx = cell.x - mx
        const dy = cell.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < revealRadius) {
          const target = 1 - dist / revealRadius
          cell.brightness = Math.max(cell.brightness, target)
        }

        cell.brightness = Math.max(0, cell.brightness - decay)

        if (cell.brightness > 0.01) {
          const alpha = cell.brightness * maxBrightness
          const r = Math.floor((10 + 235 * alpha) * 0.6)
          const g = Math.floor((10 + 235 * alpha) * 0.6)
          const b = Math.floor((11 + 234 * alpha) * 0.6)
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.fillText(cell.char, cell.x, cell.y)
        } else {
          ctx.fillStyle = "#0A0A0B"
          ctx.fillText(cell.char, cell.x, cell.y)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      initGrid(canvas)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleTouch)
      window.removeEventListener("resize", handleResize)
    }
  }, [initGrid, isMobile, performanceMode, reducedMotion])

  if (isMobile || performanceMode || reducedMotion) {
    return (
      <div
        className="absolute inset-0 dot-pattern opacity-40"
        aria-hidden="true"
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#0A0A0B" }}
      aria-hidden="true"
    />
  )
}
