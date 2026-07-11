import { useState, useCallback, useEffect } from "react"
import { Outlet } from "react-router"
import { Navigation } from "@/components/Navigation"
import { AnnouncementBanner } from "@/components/AnnouncementBanner"
import { Footer } from "@/components/Footer"
import { LoadingScreen } from "@/components/LoadingScreen"

export function Layout() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true)
  }, [])

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const onScroll = () => {
      const y = window.scrollY
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        if (y > lastY && y > 80) setHeaderHidden(true)
        else setHeaderHidden(false)
        lastY = y
        ticking = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="relative min-h-screen text-[#F5F5F5]">
      {!loadingComplete && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          transform: headerHidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.3s ease",
        }}
      >
        <Navigation />
        <AnnouncementBanner />
      </div>
      <Outlet />
      <Footer />
    </div>
  )
}
