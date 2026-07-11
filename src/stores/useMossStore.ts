import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AccentColor =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "teal"
  | "green"
  | "gunmetal"

const accentMap: Record<AccentColor, { hex: string; hue: number }> = {
  blue: { hex: "#4F8CFF", hue: 217 },
  purple: { hex: "#A855F7", hue: 271 },
  pink: { hex: "#EC4899", hue: 330 },
  red: { hex: "#EF4444", hue: 0 },
  orange: { hex: "#F97316", hue: 24 },
  teal: { hex: "#14B8A6", hue: 174 },
  green: { hex: "#22C55E", hue: 142 },
  gunmetal: { hex: "#6B7280", hue: 220 },
}

interface MossState {
  accent: AccentColor
  performanceMode: boolean
  reducedMotion: boolean
  dismissedAnnouncementId: string | null
  setAccent: (a: AccentColor) => void
  setPerformanceMode: (v: boolean) => void
  setReducedMotion: (v: boolean) => void
  setDismissedAnnouncementId: (id: string | null) => void
  getAccentHex: () => string
  getAccentHue: () => number
}

const getInitialReducedMotion = () => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export const useMossStore = create<MossState>()(
  persist(
    (set, get) => ({
      accent: "teal",
      performanceMode: false,
      reducedMotion: getInitialReducedMotion(),
      dismissedAnnouncementId: null,
      setAccent: (accent) => {
        set({ accent })
        const { hex, hue } = accentMap[accent]
        document.documentElement.style.setProperty("--accent", hex)
        document.documentElement.style.setProperty("--accent-hue", String(hue))
      },
      setPerformanceMode: (performanceMode) => set({ performanceMode }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setDismissedAnnouncementId: (dismissedAnnouncementId) =>
        set({ dismissedAnnouncementId }),
      getAccentHex: () => accentMap[get().accent].hex,
      getAccentHue: () => accentMap[get().accent].hue,
    }),
    {
      name: "moss-store",
      partialize: (state) => ({
        accent: state.accent,
        performanceMode: state.performanceMode,
        dismissedAnnouncementId: state.dismissedAnnouncementId,
      }),
    }
  )
)

// Initialize CSS custom property on load
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("moss-store")
  const accent: AccentColor = stored
    ? (JSON.parse(stored).state?.accent ?? "teal")
    : "teal"
  const { hex, hue } = accentMap[accent]
  document.documentElement.style.setProperty("--accent", hex)
  document.documentElement.style.setProperty("--accent-hue", String(hue))
}
