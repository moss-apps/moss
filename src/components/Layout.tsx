import { useState, useCallback } from "react"
import { Outlet } from "react-router"
import { AsciiFlashlight } from "@/components/AsciiFlashlight"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { LoadingScreen } from "@/components/LoadingScreen"

export function Layout() {
  const [loadingComplete, setLoadingComplete] = useState(false)

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true)
  }, [])

  return (
    <div className="relative min-h-screen text-[#F5F5F5]">
      {!loadingComplete && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AsciiFlashlight />
      </div>
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  )
}
