import { useViewportSize } from "./useViewportSize"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT): boolean {
  const { width } = useViewportSize()
  return width < breakpoint
}
