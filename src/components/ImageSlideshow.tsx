import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Attachment } from "@/lib/announcements"

// ponytail: native scroll-snap + pointer drag — no carousel lib, survives touch + mouse drag
export function ImageSlideshow({
  images,
  className = "",
}: {
  images: Attachment[]
  className?: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)

  const go = useCallback(
    (next: number) => {
      const el = scrollerRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(next, images.length - 1))
      el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" })
    },
    [images.length],
  )

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth || 1
        const idx = Math.round(el.scrollLeft / w)
        setIndex(Math.max(0, Math.min(idx, images.length - 1)))
      })
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [images.length])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const el = scrollerRef.current
    if (!el) return
    isDragging.current = true
    startX.current = e.clientX
    startScrollLeft.current = el.scrollLeft
    ;(e.target as Element).setPointerCapture(e.pointerId)
    el.style.scrollSnapType = "none"
    el.style.scrollBehavior = "auto"
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || e.pointerType !== "mouse") return
    const el = scrollerRef.current
    if (!el) return
    const dx = e.clientX - startX.current
    el.scrollLeft = startScrollLeft.current - dx
  }
  const endDrag = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !isDragging.current) return
    isDragging.current = false
    const el = scrollerRef.current
    if (!el) return
    el.style.scrollSnapType = ""
    el.style.scrollBehavior = ""
    const w = el.clientWidth || 1
    const idx = Math.round(el.scrollLeft / w)
    go(idx)
    try {
      ;(e.target as Element).releasePointerCapture(e.pointerId)
    } catch {}
  }

  if (images.length === 0) return null
  if (images.length === 1) {
    const a = images[0]
    return (
      <img
        src={a.url}
        alt={a.name}
        loading="lazy"
        className={`w-full h-auto border border-white/10 rounded-xl ${className}`}
      />
    )
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`Image gallery with ${images.length} images`}
      className={`relative overflow-hidden rounded-xl border border-white/10 group select-none ${className}`}
    >
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth touch-pan-y"
        style={{ scrollbarWidth: "none", touchAction: "pan-y" } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        tabIndex={0}
        aria-live="polite"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault()
            go(index - 1)
          }
          if (e.key === "ArrowRight") {
            e.preventDefault()
            go(index + 1)
          }
        }}
      >
        {images.map((a) => (
          <div key={a.path} className="min-w-full snap-center snap-always">
            <img
              src={a.url}
              alt={a.name}
              loading="lazy"
              draggable={false}
              className="w-full h-auto object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      <button
        aria-label="Previous image"
        onClick={() => go(index - 1)}
        disabled={index === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-sm opacity-70 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        aria-label="Next image"
        onClick={() => go(index + 1)}
        disabled={index === images.length - 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-sm opacity-70 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Image navigation">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-label={`Go to image ${i + 1} of ${images.length}`}
              aria-selected={i === index}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
        <span className="ml-1 text-[10px] font-mono text-white/70 tabular-nums">
          {index + 1} / {images.length}
        </span>
      </div>
    </div>
  )
}
