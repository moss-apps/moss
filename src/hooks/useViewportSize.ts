import { useEffect, useState } from "react"

export interface ViewportSize {
  width: number
  height: number
}

const getViewportSize = (): ViewportSize => ({
  width: typeof window === "undefined" ? 0 : window.innerWidth,
  height: typeof window === "undefined" ? 0 : window.innerHeight,
})

export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState(getViewportSize)

  useEffect(() => {
    const onResize = () => setSize(getViewportSize())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return size
}
