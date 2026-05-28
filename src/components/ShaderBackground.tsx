import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useMossStore } from "@/stores/useMossStore"
import { useIsMobile } from "@/hooks/useIsMobile"

import dotFieldFrag from "@/shaders/dotField.frag"

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport, size } = useThree()
  const accent = useMossStore((s) => s.getAccentHex())

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_accent: { value: new THREE.Color(accent) },
      u_dotScale: { value: 1.0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    uniforms.u_accent.value.set(accent)
  }, [accent, uniforms])

  useEffect(() => {
    uniforms.u_resolution.value.set(size.width, size.height)
  }, [size, uniforms])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = size.height - e.clientY
    }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = size.height - e.touches[0].clientY
      }
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("touchmove", onTouch, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("touchmove", onTouch)
    }
  }, [size.height])

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial
    mat.uniforms.u_time.value = state.clock.elapsedTime
    mat.uniforms.u_mouse.value.lerp(
      new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
      0.05
    )
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={dotFieldFrag}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

function StaticDotGrid() {
  return (
    <div
      className="absolute inset-0 dot-pattern opacity-40"
      aria-hidden="true"
    />
  )
}

export function ShaderBackground() {
  const isMobile = useIsMobile()
  const performanceMode = useMossStore((s) => s.performanceMode)
  const reducedMotion = useMossStore((s) => s.reducedMotion)

  const showShader = !isMobile && !performanceMode && !reducedMotion

  return (
    <div className="fixed inset-0 -z-10">
      {showShader ? (
        <Canvas
          orthographic
          camera={{ zoom: 1, position: [0, 0, 1] }}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          dpr={Math.min(window.devicePixelRatio, 1.5)}
          style={{ background: "#0A0A0B" }}
        >
          <ShaderPlane />
        </Canvas>
      ) : (
        <StaticDotGrid />
      )}
    </div>
  )
}
