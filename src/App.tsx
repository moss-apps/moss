import { useState, useCallback } from "react"
import { AsciiFlashlight } from "@/components/AsciiFlashlight"
import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { BentoSpine } from "@/components/BentoSpine"
import { BrokenGridIntegration } from "@/components/BrokenGridIntegration"
import { Ethos } from "@/components/Ethos"
import { Footer } from "@/components/Footer"
import { LoadingScreen } from "@/components/LoadingScreen"

function App() {
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
      <main>
        <Hero />
        <BentoSpine />
        <BrokenGridIntegration />
        <Ethos />
      </main>
      <Footer />
    </div>
  )
}

export default App
