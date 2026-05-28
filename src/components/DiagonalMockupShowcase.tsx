import { useRef, useLayoutEffect, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMossStore } from "@/stores/useMossStore"

gsap.registerPlugin(ScrollTrigger)

export interface DiagonalMockupShowcaseProps {
  id: string
  appName: string
  logoSrc: string
  headerLabel: string
  infoText: string
  mockups: string[]
  screenNames: string[]
  callouts: Array<{ title: string; description: string }>
}

/* ------------------------------------------------------------------ */
/*  Desktop position tables                                            */
/* ------------------------------------------------------------------ */

const POSITIONS = [
  { left: 18, top: 6 },
  { left: 28, top: 12 },
  { left: 38, top: 20 },
  { left: 48, top: 26 },
  { left: 58, top: 32 },
  { left: 70, top: 38 },
]

/** Callouts sit in the negative space adjacent to their paired mockup */
const CALLOUT_POSITIONS = [
  { right: 4, top: 8 },
  { right: 4, top: 16 },
  { left: 4, top: 26 },
  { right: 4, top: 34 },
  { left: 4, top: 44 },
  { left: 4, top: 52 },
]

/** Which side each callout sits on */
const CALLOUT_SIDES = ["right", "right", "left", "right", "left", "left"] as const

/* ------------------------------------------------------------------ */
/*  Static layout (reduced-motion / perf-mode) — 3 left, 3 right       */
/* ------------------------------------------------------------------ */

const STATIC_CALLOUT_POSITIONS = [
  { left: 3, top: 14 },
  { left: 3, top: 36 },
  { left: 3, top: 58 },
  { right: 3, top: 14 },
  { right: 3, top: 36 },
  { right: 3, top: 58 },
]

const STATIC_CALLOUT_SIDES = ["left", "left", "left", "right", "right", "right"] as const

/* ------------------------------------------------------------------ */
/*  Three-band depth system                                            */
/* ------------------------------------------------------------------ */

function getDepthBand(i: number) {
  if (i < 2) return { opacity: 0.5, blur: 4, scale: 0.7 }
  if (i < 4) return { opacity: 0.8, blur: 1, scale: 0.85 }
  return { opacity: 1.0, blur: 0, scale: 1.0 }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DiagonalMockupShowcase({
  id,
  appName,
  logoSrc,
  headerLabel,
  infoText,
  mockups,
  screenNames,
  callouts,
}: DiagonalMockupShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mockupRefs = useRef<(HTMLDivElement | null)[]>([])
  const calloutRefs = useRef<(HTMLDivElement | null)[]>([])
  const logoRef = useRef<HTMLDivElement | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)

  const disableChoreography = isMobile || performanceMode || reducedMotion

  /* Extract section number from headerLabel e.g. "// 01 — LATCH ..." */
  const sectionNumber = headerLabel.match(/\/\/\s*(\d+)/)?.[1] ?? ""

  /* Mobile detection */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  /* GSAP pin + scrub (desktop only, motion enabled) */
  useLayoutEffect(() => {
    if (disableChoreography) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1100%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      })

      /* Logo: start centered + enlarged, settle to top-left corner */
      const logoEl = logoRef.current
      if (logoEl) {
        tl.fromTo(
          logoEl,
          {
            x: "35vw",
            y: "32vh",
            scale: 3.5,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            duration: 0.12,
          },
          0
        )
      }

      mockupRefs.current.forEach((el, i) => {
        if (!el) return
        const band = getDepthBand(i)
        const start = i * 0.16

        /* Varied entrance vectors — all drift in from upper-left quadrant */
        const entranceX = -35 + (i % 3) * 6
        const entranceY = -22 + (i % 3) * 10

        tl.fromTo(
          el,
          {
            x: `${entranceX}vw`,
            y: `${entranceY}vh`,
            opacity: 0,
            scale: band.scale * 0.82,
            filter: band.blur > 0
              ? `blur(${band.blur + 2}px)`
              : `blur(2px)`,
          },
          {
            x: 0,
            y: 0,
            opacity: band.opacity,
            scale: band.scale,
            filter: band.blur > 0
              ? `blur(${band.blur}px)`
              : "none",
            ease: "none",
          },
          start
        )
      })

      calloutRefs.current.forEach((el, i) => {
        if (!el) return
        const fadeIn = i * 0.16 + 0.08
        const fadeOut = (i + 1) * 0.16 + 0.08

        /* Fade in when mockup becomes focal */
        tl.fromTo(
          el,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "none", duration: 0.1 },
          fadeIn
        )

        /* Fade out when next mockup takes focus — only 2 visible at a time */
        if (i < callouts.length - 1) {
          tl.to(
            el,
            { opacity: 0, y: -8, ease: "none", duration: 0.1 },
            fadeOut
          )
        }
      })
    }, section)

    return () => ctx.revert()
  }, [disableChoreography, mockups.length, callouts.length])

  const setMockupRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      mockupRefs.current[i] = el
    },
    []
  )

  const setCalloutRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      calloutRefs.current[i] = el
    },
    []
  )

  const positions = POSITIONS

  /* ---------------------------------------------------------------- */
  /*  Mobile / reduced-motion render                                   */
  /* ---------------------------------------------------------------- */
  if (isMobile) {
    return (
      <section id={id} className="relative py-20 md:py-24 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <div className="text-label text-[var(--accent)] mb-3">
              {headerLabel}
            </div>
            <img
              src={logoSrc}
              alt={appName}
              className="h-10 metallic-paint"
            />
          </motion.div>

          {/* Vertical stack with alternating offset */}
          <div className="space-y-20">
            {mockups.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className={i % 2 === 1 ? "ml-10" : ""}
              >
                <div className="text-label text-[#8A8A90] mb-2">
                  // {String(i + 1).padStart(2, "0")} —{" "}
                  {screenNames[i]?.toUpperCase()}
                </div>
                <img
                  src={src}
                  alt={`${appName} screen ${i + 1}`}
                  className="w-full max-w-[240px] rounded-[2px] border border-[rgba(255,255,255,0.12)]"
                  loading="lazy"
                />
                {callouts[i] && (
                  <div className="mt-4 max-w-[240px]">
                    <h4 className="font-display text-sm text-[#F5F5F5] mb-1">
                      // {String(i + 1).padStart(2, "0")} — {callouts[i].title}
                    </h4>
                    <p className="text-xs text-[#8A8A90] leading-relaxed">
                      {callouts[i].description}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Info block */}
          <div className="mt-16 pt-6 border-t border-[rgba(255,255,255,0.08)]">
            <p className="text-label text-[#8A8A90]">{infoText}</p>
          </div>
        </div>
      </section>
    )
  }

  /* ---------------------------------------------------------------- */
  /*  Desktop render (static when reduced-motion / perf-mode)          */
  /* ---------------------------------------------------------------- */
  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative h-screen overflow-hidden"
    >
      {/* Faint dot-grid background */}
      <div className="absolute inset-0 dot-pattern opacity-[0.04]" />

      {/* Brutalist frame — hairline border */}
      <div className="absolute inset-3 md:inset-4 border border-[rgba(255,255,255,0.08)] pointer-events-none z-0" />

      {/* Vertical column guides — 1/12 grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-[rgba(255,255,255,0.08)]"
            style={{ left: `${((i + 1) / 12) * 100}%` }}
          />
        ))}
      </div>

      {/* Large dotted section glyph — pointillist mark */}
      <div
        className="absolute -top-1 -left-1 md:top-1 md:left-1 z-10 font-mono font-black text-[120px] leading-none tracking-tighter opacity-[0.10] pointer-events-none select-none"
        style={{
          color: "transparent",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.7) 1.5px, transparent 1.5px)",
          backgroundSize: "4px 4px",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {sectionNumber}
      </div>

      {/* Brutalist header — animates from center to corner */}
      <div
        ref={logoRef}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20"
        style={{
          opacity: disableChoreography ? undefined : 0,
          willChange: disableChoreography ? undefined : "transform, opacity",
        }}
      >
        <div className="text-label text-[var(--accent)] mb-2">
          {headerLabel}
        </div>
        <img
          src={logoSrc}
          alt={appName}
          className="h-10 md:h-12 metallic-paint"
        />
      </div>

      {/* Mockups — positioned along diagonal with three-band depth */}
      {mockups.map((src, i) => {
        const pos = positions[i]

        return (
          <div
            key={i}
            ref={(el) => setMockupRef(el, i)}
            className="absolute w-[16vw] max-w-[260px] min-w-[140px]"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              zIndex: i + 1,
              willChange: disableChoreography
                ? undefined
                : "transform, opacity, filter",
              opacity: disableChoreography ? 1 : 0,
              transform: undefined,
              filter: undefined,
            }}
          >
            {/* Metadata label */}
            <div className="text-label text-[#8A8A90] mb-1 whitespace-nowrap">
              // {String(i + 1).padStart(2, "0")} —{" "}
              {screenNames[i]?.toUpperCase()}
            </div>
            <img
              src={src}
              alt={`${appName} screen ${i + 1}`}
              className="w-full h-auto rounded-[2px] border border-[rgba(255,255,255,0.12)]"
              loading="lazy"
            />
          </div>
        )
      })}

      {/* Floating text callouts — paired 1:1 with mockups */}
      {callouts.map((callout, i) => {
        const side = disableChoreography ? STATIC_CALLOUT_SIDES[i] : CALLOUT_SIDES[i]
        const leaderClass =
          side === "right" ? "callout-leader-left" : "callout-leader-right"

        const posStyle = disableChoreography
          ? STATIC_CALLOUT_POSITIONS[i].left !== undefined
            ? { left: `${STATIC_CALLOUT_POSITIONS[i].left}%`, top: `${STATIC_CALLOUT_POSITIONS[i].top}%` }
            : { right: `${STATIC_CALLOUT_POSITIONS[i].right}%`, top: `${STATIC_CALLOUT_POSITIONS[i].top}%` }
          : CALLOUT_POSITIONS[i].left !== undefined
            ? { left: `${CALLOUT_POSITIONS[i].left}%`, top: `${CALLOUT_POSITIONS[i].top}%` }
            : { right: `${CALLOUT_POSITIONS[i].right}%`, top: `${CALLOUT_POSITIONS[i].top}%` }

        return (
          <div
            key={`callout-${i}`}
            ref={(el) => setCalloutRef(el, i)}
            className={`absolute glass rounded-[2px] p-3 md:p-4 max-w-[200px] md:max-w-[240px] ${leaderClass}`}
            style={{
              ...posStyle,
              zIndex: 30,
              opacity: disableChoreography ? 1 : 0,
            }}
          >
            {/* Halftone dot texture inside callout */}
            <div
              className="absolute inset-0 rounded-[2px] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "6px 6px",
              }}
            />
            <div className="relative z-10">
              <h4 className="font-display text-xs md:text-sm text-[#F5F5F5] mb-1">
                // {String(i + 1).padStart(2, "0")} — {callout.title}
              </h4>
              <p className="text-[10px] md:text-xs text-[#8A8A90] leading-relaxed">
                {callout.description}
              </p>
            </div>
          </div>
        )
      })}

      {/* Brutalist info block — anchored bottom-left of frame */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20">
        <p className="text-label text-[#8A8A90]">{infoText}</p>
      </div>
    </section>
  )
}
