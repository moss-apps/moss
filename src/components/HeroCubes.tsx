import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
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

const LOGO_SOURCES = [
  { url: "/assets/moss_logo.svg", letter: "M" },
  { url: "/assets/logos/flick_logo.svg", letter: "F" },
  { url: "/assets/logos/latch_logo.svg", letter: "L" },
]

const textureCache = new Map<string, Promise<THREE.CanvasTexture>>()

function getFaceTexture(url: string, letter: string) {
  const cached = textureCache.get(url)
  if (cached) return cached
  const promise = new Promise<THREE.CanvasTexture>((resolve) => {
    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      resolve(new THREE.CanvasTexture(canvas))
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
        const maxW = size * 0.52
        const maxH = size * 0.52
        const scale = Math.min(maxW / img.width, maxH / img.height)
        const w = img.width * scale
        const h = img.height * scale
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
      } else {
        ctx.fillStyle = "#e8e8ea"
        ctx.font = "600 210px 'Space Grotesk', sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(letter, size / 2, size / 2 + 10)
      }
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      resolve(tex)
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
  texture,
  track,
  phase,
  frozen,
  geometry,
}: {
  texture: THREE.Texture
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
        map={texture}
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
    for (const track of tracks) {
      sampleTrack(track, t, sp.current, sr.current)
      maxX = Math.max(maxX, Math.abs(sp.current[0]))
      maxY = Math.max(maxY, Math.abs(sp.current[1]))
    }
    const need = Math.max(maxX, maxY) * 2 + 1.1
    const avail = Math.min(viewport.width, viewport.height) * 0.96
    const targetScale = Math.min(1.3, avail / need)

    if (frozen) {
      g.scale.setScalar(targetScale)
      g.rotation.set(0, 0, 0)
      g.position.set(0, 0, 0)
      return
    }
    const e = state.clock.elapsedTime
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, 0.05))
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * 0.22, 0.05)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.14, 0.05)
    g.position.y = Math.sin(e * 0.5) * 0.07
  })

  return <group ref={group}>{children}</group>
}

function CubeScene({
  textures,
  frozen,
  lowEnd,
  accentHex,
}: {
  textures: THREE.Texture[]
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
      {lowEnd ? null : (
        <Environment key={accentHex} resolution={256} frames={1}>
          <color attach="background" args={["#08090b"]} />
          <Lightformer intensity={3} position={[0, 4, 2]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer intensity={1.6} position={[-4, 0.5, 1]} rotation-y={Math.PI / 2} scale={[7, 2.2, 1]} color="#dfe8ff" />
          <Lightformer intensity={1.6} position={[4, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[7, 2.2, 1]} />
          <Lightformer intensity={2.4} position={[0, 1.5, 5]} scale={[2.5, 2.5, 1]} color={accentHex} />
          <Lightformer intensity={0.9} position={[0, -4, 1]} rotation-x={-Math.PI / 2} scale={[8, 4, 1]} color={accentHex} />
        </Environment>
      )}
      <Rig tracks={TRACKS} frozen={frozen}>
        {textures.map((tex, i) => (
          <Cube
            key={i}
            texture={tex}
            track={TRACKS[i]}
            phase={i * 2.1}
            frozen={frozen}
            geometry={geometry}
          />
        ))}
      </Rig>
    </>
  )
}

export function HeroCubes({ className }: { className?: string }) {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)
  const accent = useMossStore((s) => s.accent)
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null)

  useEffect(() => {
    let alive = true
    Promise.all(LOGO_SOURCES.map((s) => getFaceTexture(s.url, s.letter))).then(
      (tx) => {
        if (alive) setTextures(tx)
      }
    )
    return () => {
      alive = false
    }
  }, [])

  if (!textures) return null

  const lowEnd = isMobile || performanceMode
  const accentHex = accentMap[accent].hex
  const frozen = reducedMotion

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        frameloop={frozen ? "demand" : "always"}
        camera={{ position: [0, 0, 7], fov: 34 }}
        dpr={Math.min(window.devicePixelRatio, lowEnd ? 1.5 : 2)}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <CubeScene
          textures={textures}
          frozen={frozen}
          lowEnd={lowEnd}
          accentHex={accentHex}
        />
      </Canvas>
    </div>
  )
}
