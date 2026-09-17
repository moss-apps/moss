import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer, RoundedBox } from "@react-three/drei"
import { EffectComposer, Vignette } from "@react-three/postprocessing"
import * as THREE from "three"
import { RoundedBoxGeometry } from "three-stdlib"
import { accentMap, useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

type Vec3 = [number, number, number]
type Ease = "linear" | "in" | "out" | "inout" | "back"

interface Keyframe {
  t: number
  p: Vec3
  r: Vec3
  ease?: Ease
}

const TAU = Math.PI * 2
const GAP = 1.18
const CAM_Z = 7
const _euler = new THREE.Euler()
const _mat = new THREE.Matrix4()
const LOOP = 20
const FROZEN_T = 6.4

const easeFns: Record<Ease, (u: number) => number> = {
  linear: (u) => u,
  in: (u) => u * u * u,
  out: (u) => 1 - (1 - u) ** 3,
  inout: (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2),
  back: (u) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2
  },
}

function sampleTrack(
  track: Keyframe[],
  t: number,
  outP: Vec3,
  outR: Vec3
) {
  const last = track.length - 1
  if (t <= track[0].t) {
    for (let j = 0; j < 3; j++) {
      outP[j] = track[0].p[j]
      outR[j] = track[0].r[j]
    }
    return
  }
  if (t >= track[last].t) {
    for (let j = 0; j < 3; j++) {
      outP[j] = track[last].p[j]
      outR[j] = track[last].r[j]
    }
    return
  }
  for (let i = 0; i < last; i++) {
    const a = track[i]
    const b = track[i + 1]
    if (t < a.t || t > b.t) continue
    const span = b.t - a.t
    const u = span <= 0 ? 1 : (t - a.t) / span
    const e = easeFns[b.ease ?? "inout"](Math.min(Math.max(u, 0), 1))
    for (let j = 0; j < 3; j++) {
      outP[j] = a.p[j] + (b.p[j] - a.p[j]) * e
      outR[j] = a.r[j] + (b.r[j] - a.r[j]) * e
    }
    return
  }
}

// Choreography (seconds, loops at 20):
// 0-2.6 converge to vertical stack, 3.4-6 tumble into horizontal row,
// 6.8-8.8 separate + spin to show logos, 10-13 orbit swap and snap back
// into a stack, 13.8-16.2 row again with spins, 17-20 scatter out.
const MOSS_TRACK: Keyframe[] = [
  { t: 0, p: [-3, 1.5, -1.4], r: [0.5, 0.9, 0.35] },
  { t: 2.6, p: [0, GAP, 0], r: [0, 0, 0], ease: "out" },
  { t: 3.4, p: [0, GAP, 0], r: [0, 0, 0], ease: "linear" },
  { t: 4.7, p: [-1.07, 1.07, 0.1], r: [0, 0, -Math.PI], ease: "inout" },
  { t: 6, p: [-GAP, 0, 0], r: [0, 0, -TAU], ease: "inout" },
  { t: 6.8, p: [-GAP, 0, 0], r: [0, 0, -TAU], ease: "linear" },
  { t: 8.8, p: [-2.35, 0.55, 0.45], r: [0, -TAU, 0], ease: "inout" },
  { t: 10, p: [-2.35, 0.55, 0.45], r: [0.1, -TAU, -0.06], ease: "linear" },
  { t: 11.2, p: [1.5, 1.6, -0.5], r: [0.35, -TAU + Math.PI, 0.25], ease: "inout" },
  { t: 13, p: [0, GAP, 0], r: [0, -TAU, 0], ease: "back" },
  { t: 13.8, p: [0, GAP, 0], r: [0, -TAU, 0], ease: "linear" },
  { t: 15, p: [-1.07, 1.07, 0.1], r: [0, -1.5 * TAU, -Math.PI], ease: "inout" },
  { t: 16.2, p: [-GAP, 0, 0], r: [0, -2 * TAU, 0], ease: "inout" },
  { t: 17, p: [-GAP, 0, 0], r: [0, -2 * TAU, 0], ease: "linear" },
  { t: 20, p: [-3, 1.5, -1.4], r: [0.5, 0.9, 0.35], ease: "inout" },
]

const FLICK_TRACK: Keyframe[] = [
  { t: 0, p: [2.8, -1.2, -0.9], r: [-0.55, -0.7, 0.4] },
  { t: 1.2, p: [2.8, -1.2, -0.9], r: [-0.55, -0.7, 0.4], ease: "linear" },
  { t: 2.6, p: [0, 0, 0], r: [0, 0, 0], ease: "inout" },
  { t: 3.4, p: [0, 0, 0], r: [0, 0, 0], ease: "linear" },
  { t: 6, p: [0, 0, 0.35], r: [0, TAU, 0], ease: "inout" },
  { t: 6.8, p: [0, 0, 0.35], r: [0, TAU, 0], ease: "linear" },
  { t: 8.8, p: [0, -0.75, 0.7], r: [0, 2 * TAU, 0], ease: "inout" },
  { t: 10, p: [0, -0.75, 0.7], r: [0.1, 2 * TAU, -0.06], ease: "linear" },
  { t: 11.2, p: [-1.7, -1.5, -0.4], r: [0.35, 2 * TAU - Math.PI, 0.25], ease: "inout" },
  { t: 13, p: [0, 0, 0], r: [0, 2 * TAU, 0], ease: "back" },
  { t: 13.8, p: [0, 0, 0], r: [0, 2 * TAU, 0], ease: "linear" },
  { t: 16.2, p: [0, 0, 0], r: [0, 3 * TAU, 0], ease: "inout" },
  { t: 17, p: [0, 0, 0], r: [0, 3 * TAU, 0], ease: "linear" },
  { t: 20, p: [2.8, -1.2, -0.9], r: [-0.55, -0.7, 0.4], ease: "inout" },
]

const LATCH_TRACK: Keyframe[] = [
  { t: 0, p: [3.2, 1.4, -1.6], r: [0.6, -1, -0.3] },
  { t: 2.6, p: [0, -GAP, 0], r: [0, 0, 0], ease: "out" },
  { t: 3.4, p: [0, -GAP, 0], r: [0, 0, 0], ease: "linear" },
  { t: 4.7, p: [1.07, -1.07, 0.1], r: [0, 0, Math.PI], ease: "inout" },
  { t: 6, p: [GAP, 0, 0], r: [0, 0, TAU], ease: "inout" },
  { t: 6.8, p: [GAP, 0, 0], r: [0, 0, TAU], ease: "linear" },
  { t: 8.8, p: [2.35, 0.55, 0.45], r: [0, TAU, 0], ease: "inout" },
  { t: 10, p: [2.35, 0.55, 0.45], r: [0.1, TAU, -0.06], ease: "linear" },
  { t: 11.2, p: [0.4, 0.7, 1.3], r: [0.35, TAU + Math.PI, 0.25], ease: "inout" },
  { t: 13, p: [0, -GAP, 0], r: [0, 2 * TAU, 0], ease: "back" },
  { t: 13.8, p: [0, -GAP, 0], r: [0, 2 * TAU, 0], ease: "linear" },
  { t: 15, p: [1.07, -1.07, 0.1], r: [0, 2.5 * TAU, Math.PI], ease: "inout" },
  { t: 16.2, p: [GAP, 0, 0], r: [0, 3 * TAU, 0], ease: "inout" },
  { t: 17, p: [GAP, 0, 0], r: [0, 3 * TAU, 0], ease: "linear" },
  { t: 20, p: [3.2, 1.4, -1.6], r: [0.6, -1, -0.3], ease: "inout" },
]

const TRACKS: Keyframe[][] = [MOSS_TRACK, FLICK_TRACK, LATCH_TRACK]

type PropKind = "cube" | "sphere" | "torus" | "octa"

interface PropDef {
  kind: PropKind
  p: Vec3
  rot: Vec3
  size: number
  tone: "silver" | "accent"
  bob: number
  spin: number
  phase: number
}

// Companions around the cluster. They may bleed off the frame edges — only
// the logo cubes drive the autofit.
const PROP_DEFS: PropDef[] = [
  { kind: "cube", p: [-1.05, -0.85, -1.25], rot: [0.6, 0.3, 0.2], size: 0.5, tone: "silver", bob: 0.4, spin: 0.18, phase: 0 },
  { kind: "cube", p: [-1.65, 0, -1.4], rot: [-0.3, 0.5, 0.1], size: 0.34, tone: "accent", bob: 0.55, spin: 0.24, phase: 1.7 },
  { kind: "sphere", p: [-1.75, -1.25, -1.35], rot: [0, 0, 0], size: 0.44, tone: "accent", bob: 0.7, spin: 0, phase: 3.2 },
  { kind: "sphere", p: [-0.45, -1.3, -1.05], rot: [0, 0, 0], size: 0.3, tone: "silver", bob: 0.85, spin: 0, phase: 5.1 },
  { kind: "torus", p: [1.55, 1.25, -2], rot: [1.15, 0.35, 0], size: 1.1, tone: "silver", bob: 0.35, spin: 0.3, phase: 2.4 },
  { kind: "sphere", p: [2.15, -0.6, -1.5], rot: [0, 0, 0], size: 0.36, tone: "silver", bob: 0.75, spin: 0, phase: 0.9 },
  { kind: "sphere", p: [2.6, 0.4, -1.15], rot: [0, 0, 0], size: 0.24, tone: "accent", bob: 0.6, spin: 0, phase: 4.4 },
  { kind: "octa", p: [-2.3, 1.1, -1.9], rot: [0.4, 0.8, 0.2], size: 0.5, tone: "accent", bob: 0.5, spin: 0.32, phase: 2.9 },
  { kind: "cube", p: [-2.4, -0.65, -1.55], rot: [0.35, -0.5, 0.15], size: 0.3, tone: "silver", bob: 0.45, spin: 0.22, phase: 5.8 },
  { kind: "sphere", p: [0.75, -1.35, -1.8], rot: [0, 0, 0], size: 0.52, tone: "silver", bob: 0.5, spin: 0, phase: 1.2 },
  { kind: "torus", p: [-0.2, 1.35, -2.2], rot: [1.35, 0.25, 0.4], size: 0.7, tone: "accent", bob: 0.4, spin: 0.26, phase: 3.7 },
]

function propExtent(d: PropDef) {
  switch (d.kind) {
    case "cube":
      return d.size * 0.8
    case "sphere":
      return d.size * 0.5
    case "torus":
      return d.size * 0.57
    case "octa":
      return d.size * 0.5
  }
}

const LOGO_SOURCES = [
  { url: "/assets/moss_logo.svg", letter: "M" },
  { url: "/assets/logos/flick_logo.svg", letter: "F" },
  { url: "/assets/logos/latch_logo.svg", letter: "L" },
]

interface FaceMaps {
  map: THREE.CanvasTexture
  emissiveMap: THREE.CanvasTexture
}

const textureCache = new Map<string, Promise<FaceMaps>>()

function getFaceTexture(url: string, letter: string) {
  const cached = textureCache.get(url)
  if (cached) return cached
  const promise = new Promise<FaceMaps>((resolve) => {
    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = size
    const glowCanvas = document.createElement("canvas")
    glowCanvas.width = glowCanvas.height = size
    const ctx = canvas.getContext("2d")
    const gctx = glowCanvas.getContext("2d")
    const finish = () => {
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      const glow = new THREE.CanvasTexture(glowCanvas)
      glow.colorSpace = THREE.SRGBColorSpace
      glow.anisotropy = 8
      resolve({ map: tex, emissiveMap: glow })
    }
    if (!ctx || !gctx) {
      finish()
      return
    }
    const paint = (img: HTMLImageElement | null) => {
      const g = ctx.createRadialGradient(
        size * 0.35,
        size * 0.3,
        size * 0.08,
        size * 0.5,
        size * 0.5,
        size * 0.78
      )
      g.addColorStop(0, "#3b3e45")
      g.addColorStop(0.55, "#26282d")
      g.addColorStop(1, "#151619")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
      ctx.save()
      ctx.translate(size / 2, size / 2)
      ctx.strokeStyle = "#ffffff"
      ctx.globalAlpha = 0.045
      for (let i = 1; i <= 42; i++) {
        ctx.beginPath()
        ctx.arc(0, 0, i * 6, 0, TAU)
        ctx.lineWidth = 1
        ctx.stroke()
      }
      ctx.restore()

      if (img) {
        const maxW = size * 0.56
        const maxH = size * 0.56
        const scale = Math.min(maxW / img.width, maxH / img.height)
        const w = img.width * scale
        const h = img.height * scale
        const x = (size - w) / 2
        const y = (size - h) / 2
        ctx.drawImage(img, x, y, w, h)
        gctx.drawImage(img, x, y, w, h)
        gctx.globalCompositeOperation = "source-in"
        gctx.fillStyle = "#ffffff"
        gctx.fillRect(0, 0, size, size)
        gctx.globalCompositeOperation = "source-over"
      } else {
        ctx.fillStyle = "#e8e8ea"
        ctx.font = "600 210px 'Space Grotesk', sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(letter, size / 2, size / 2 + 10)
        gctx.fillStyle = "#ffffff"
        gctx.font = "600 210px 'Space Grotesk', sans-serif"
        gctx.textAlign = "center"
        gctx.textBaseline = "middle"
        gctx.fillText(letter, size / 2, size / 2 + 10)
      }
      finish()
    }
    const img = new Image()
    img.onload = () => paint(img)
    img.onerror = () => paint(null)
    img.src = url
  })
  textureCache.set(url, promise)
  return promise
}

function Cube({
  maps,
  track,
  phase,
  frozen,
  geometry,
}: {
  maps: FaceMaps
  track: Keyframe[]
  phase: number
  frozen: boolean
  geometry: RoundedBoxGeometry
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const p = useRef<Vec3>([0, 0, 0])
  const r = useRef<Vec3>([0, 0, 0])

  useFrame((state) => {
    const mesh = ref.current
    if (frozen) {
      sampleTrack(track, FROZEN_T, p.current, r.current)
      mesh.position.set(p.current[0], p.current[1], p.current[2])
      mesh.rotation.set(r.current[0], r.current[1], r.current[2])
      return
    }
    const e = state.clock.elapsedTime
    sampleTrack(track, e % LOOP, p.current, r.current)
    mesh.position.set(
      p.current[0],
      p.current[1] + Math.sin(e * 1.1 + phase) * 0.04,
      p.current[2]
    )
    mesh.rotation.set(
      r.current[0] + Math.sin(e * 0.7 + phase * 1.3) * 0.05,
      r.current[1] + Math.cos(e * 0.55 + phase) * 0.06,
      r.current[2]
    )
  })

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshPhysicalMaterial
        map={maps.map}
        emissiveMap={maps.emissiveMap}
        emissive="#ffffff"
        emissiveIntensity={0.9}
        metalness={0.88}
        roughness={0.3}
        clearcoat={0.55}
        clearcoatRoughness={0.22}
        envMapIntensity={1.15}
      />
    </mesh>
  )
}

function Rig({
  tracks,
  frozen,
  children,
}: {
  tracks: Keyframe[][]
  frozen: boolean
  children: React.ReactNode
}) {
  const group = useRef<THREE.Group>(null!)
  const pointer = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  const sp = useRef<Vec3>([0, 0, 0])
  const sr = useRef<Vec3>([0, 0, 0])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  useFrame((state) => {
    const g = group.current
    const t = frozen ? FROZEN_T : state.clock.elapsedTime % LOOP
    let maxX = 0
    let maxY = 0
    let closestZ = -Infinity
    let spreadZ = 0
    for (const track of tracks) {
      sampleTrack(track, t, sp.current, sr.current)
      _euler.set(sr.current[0], sr.current[1], sr.current[2])
      _mat.makeRotationFromEuler(_euler)
      const e = _mat.elements
      const hx = 0.5 * (Math.abs(e[0]) + Math.abs(e[4]) + Math.abs(e[8])) + 0.05
      const hy = 0.5 * (Math.abs(e[1]) + Math.abs(e[5]) + Math.abs(e[9])) + 0.05
      const hz = 0.5 * (Math.abs(e[2]) + Math.abs(e[6]) + Math.abs(e[10])) + 0.05
      maxX = Math.max(maxX, Math.abs(sp.current[0]) + hx)
      maxY = Math.max(maxY, Math.abs(sp.current[1]) + hy)
      closestZ = Math.max(closestZ, sp.current[2] + hz)
      spreadZ = Math.max(spreadZ, Math.abs(sp.current[2]) + hz)
    }
    for (const d of PROP_DEFS) {
      const r = propExtent(d)
      const fp = CAM_Z / (CAM_Z - d.p[2])
      maxX = Math.max(maxX, (Math.abs(d.p[0]) + r) * fp)
      maxY = Math.max(maxY, (Math.abs(d.p[1]) + r) * fp)
      spreadZ = Math.max(spreadZ, Math.abs(d.p[2]) + r)
    }
    const f = CAM_Z / (CAM_Z - closestZ)
    const rx = g.rotation.x
    const ry = g.rotation.y
    const ex = maxX * Math.abs(Math.cos(ry)) + spreadZ * Math.abs(Math.sin(ry))
    const ey = maxY * Math.abs(Math.cos(rx)) + spreadZ * Math.abs(Math.sin(rx))
    const needX = (ex * f + 0.12) * 2 * 1.02
    const needY = (ey * f + 0.12) * 2 * 1.02
    const targetScale = Math.min(
      1.8,
      (viewport.width * 0.94) / needX,
      (viewport.height * 0.94) / needY
    )

    if (frozen) {
      g.scale.setScalar(targetScale)
      g.rotation.set(0, 0, 0)
      g.position.set(0, 0, 0)
      return
    }
    const e = state.clock.elapsedTime
    const next = THREE.MathUtils.lerp(g.scale.x, targetScale, 0.05)
    g.scale.setScalar(Math.min(next, targetScale))
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * 0.22, 0.05)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.14, 0.05)
    g.position.y = Math.sin(e * 0.5) * 0.07
  })

  return <group ref={group}>{children}</group>
}

const SILVER = {
  metalness: 0.9,
  roughness: 0.26,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1.2,
}
const CHROME = {
  metalness: 0.95,
  roughness: 0.15,
  clearcoat: 0.7,
  clearcoatRoughness: 0.15,
  envMapIntensity: 1.3,
}
const COLORED = {
  metalness: 0.92,
  roughness: 0.22,
  clearcoat: 0.6,
  clearcoatRoughness: 0.18,
  envMapIntensity: 1.25,
}

function Satellites({
  accentHex,
  frozen,
  lowEnd,
}: {
  accentHex: string
  frozen: boolean
  lowEnd: boolean
}) {
  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    if (frozen) return
    const e = state.clock.elapsedTime
    PROP_DEFS.forEach((d, i) => {
      const m = refs.current[i]
      if (!m) return
      m.position.y = d.p[1] + Math.sin(e * d.bob + d.phase) * 0.06
      if (d.spin > 0) {
        m.rotation.set(
          d.rot[0] + e * d.spin,
          d.rot[1] + e * d.spin * 0.8,
          d.rot[2] + Math.sin(e * 0.4 + d.phase) * 0.15
        )
      }
    })
  })

  return (
    <group>
      {PROP_DEFS.map((d, i) => {
        const material =
          d.tone === "accent" ? (
            <meshPhysicalMaterial color={accentHex} {...(d.kind === "torus" ? CHROME : COLORED)} />
          ) : (
            <meshPhysicalMaterial
              color="#c9cdd4"
              {...(d.kind === "torus" ? CHROME : SILVER)}
            />
          )
        const setRef = (m: THREE.Mesh | null) => {
          refs.current[i] = m
        }
        if (d.kind === "cube") {
          return (
            <RoundedBox
              key={i}
              ref={setRef}
              args={[d.size, d.size, d.size]}
              radius={d.size * 0.25}
              position={d.p}
              rotation={d.rot}
            >
              {material}
            </RoundedBox>
          )
        }
        return (
          <mesh
            key={i}
            ref={setRef}
            position={d.p}
            rotation={d.rot}
          >
            {d.kind === "sphere" ? (
              <sphereGeometry args={[d.size / 2, lowEnd ? 16 : 24, lowEnd ? 12 : 18]} />
            ) : d.kind === "torus" ? (
              <torusGeometry
                args={[d.size / 2, d.size * 0.068, lowEnd ? 8 : 12, lowEnd ? 24 : 36]}
              />
            ) : (
              <octahedronGeometry args={[d.size / 2, 0]} />
            )}
            {material}
          </mesh>
        )
      })}
    </group>
  )
}

function Dust({ frozen, lowEnd }: { frozen: boolean; lowEnd: boolean }) {
  const group = useRef<THREE.Group>(null!)
  const positions = useMemo(() => {
    const count = lowEnd ? 70 : 150
    const arr = new Float32Array(count * 3)
    const rand = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand(i * 3 + 1) - 0.5) * 11
      arr[i * 3 + 1] = (rand(i * 3 + 2) - 0.5) * 6
      arr[i * 3 + 2] = 0.5 - rand(i * 3 + 3) * 4
    }
    return arr
  }, [lowEnd])

  useFrame((state) => {
    if (frozen) return
    group.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          sizeAttenuation
          transparent
          opacity={0.45}
          color="#cfd6de"
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function CubeScene({
  faces,
  frozen,
  lowEnd,
  accentHex,
}: {
  faces: FaceMaps[]
  frozen: boolean
  lowEnd: boolean
  accentHex: string
}) {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(1, 1, 1, lowEnd ? 3 : 5, 0.12),
    [lowEnd]
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3.5, 5, 4]} intensity={2.2} />
      <pointLight position={[-4, -2.5, 3.5]} intensity={60} color={accentHex} />
      <pointLight position={[4.5, 2.5, 2.5]} intensity={28} color="#9db4ff" />
      <directionalLight position={[-3, 2, -3]} intensity={1.1} color={accentHex} />
      <directionalLight position={[3.5, -1.5, -2.5]} intensity={0.9} color="#9db4ff" />
      <Environment key={accentHex} resolution={lowEnd ? 64 : 256} frames={1}>
        <color attach="background" args={["#08090b"]} />
        <Lightformer intensity={3} position={[0, 4, 2]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer intensity={1.6} position={[-4, 0.5, 1]} rotation-y={Math.PI / 2} scale={[7, 2.2, 1]} color="#dfe8ff" />
        <Lightformer intensity={1.6} position={[4, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[7, 2.2, 1]} />
        <Lightformer intensity={2.4} position={[0, 1.5, 5]} scale={[2.5, 2.5, 1]} color={accentHex} />
        <Lightformer intensity={0.9} position={[0, -4, 1]} rotation-x={-Math.PI / 2} scale={[8, 4, 1]} color={accentHex} />
      </Environment>
      <Dust frozen={frozen} lowEnd={lowEnd} />
      <Rig tracks={TRACKS} frozen={frozen}>
        <Satellites accentHex={accentHex} frozen={frozen} lowEnd={lowEnd} />
        {faces.map((face, i) => (
          <Cube
            key={i}
            maps={face}
            track={TRACKS[i]}
            phase={i * 2.1}
            frozen={frozen}
            geometry={geometry}
          />
        ))}
      </Rig>
      {lowEnd ? null : (
        <EffectComposer multisampling={4}>
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}
    </>
  )
}

export function HeroCubes({ className }: { className?: string }) {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)
  const accent = useMossStore((s) => s.accent)
  const [faces, setFaces] = useState<FaceMaps[] | null>(null)

  useEffect(() => {
    let alive = true
    Promise.all(LOGO_SOURCES.map((s) => getFaceTexture(s.url, s.letter))).then(
      (maps) => {
        if (alive) setFaces(maps)
      }
    )
    return () => {
      alive = false
    }
  }, [])

  if (!faces) return null

  const lowEnd = isMobile || performanceMode
  const accentHex = accentMap[accent].hex
  const frozen = reducedMotion

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        frameloop={frozen ? "demand" : "always"}
        camera={{ position: [0, 0, CAM_Z], fov: 34 }}
        dpr={Math.min(window.devicePixelRatio, lowEnd ? 1.5 : 2)}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <CubeScene
          faces={faces}
          frozen={frozen}
          lowEnd={lowEnd}
          accentHex={accentHex}
        />
      </Canvas>
    </div>
  )
}
