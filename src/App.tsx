import { useState, useCallback } from "react"
import { AsciiFlashlight } from "@/components/AsciiFlashlight"
import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { Ecosystem } from "@/components/Ecosystem"
import { DiagonalMockupShowcase } from "@/components/DiagonalMockupShowcase"
import { BrokenGridIntegration } from "@/components/BrokenGridIntegration"
import { Ethos } from "@/components/Ethos"
import { Footer } from "@/components/Footer"
import { LoadingScreen } from "@/components/LoadingScreen"

const latchMockups = [
  "/assets/mockups/latch_one.svg",
  "/assets/mockups/latch_two.svg",
  "/assets/mockups/latch_three.svg",
  "/assets/mockups/latch_four.svg",
  "/assets/mockups/latch_five.svg",
  "/assets/mockups/latch_six.svg",
]

const flickMockups = [
  "/assets/mockups/flick_one.svg",
  "/assets/mockups/flick_two.svg",
  "/assets/mockups/flick_three.svg",
  "/assets/mockups/flick_four.svg",
  "/assets/mockups/flick_five.svg",
  "/assets/mockups/flick_six.svg",
]

const latchScreenNames = [
  "Vault Dashboard",
  "Key Manager",
  "Decoy Vault",
  "Folder Explorer",
  "Kill Switch",
  "Share Link",
]

const latchCallouts = [
  { title: "Vault Dashboard", description: "Your encrypted files at a glance. Biometric unlock ready." },
  { title: "AES-256 Encryption", description: "Military-grade protection. We never hold the keys." },
  { title: "Decoy Mode", description: "Plausible deniability layer for sensitive situations." },
  { title: "Folder Vaults", description: "Organized containers with independent passcodes." },
  { title: "Auto-Kill", description: "Timed self-destruct triggers for emergency scenarios." },
  { title: "Secure Share", description: "Memory-only handoff to Flick Player." },
]

const flickScreenNames = [
  "Library Grid",
  "Now Playing",
  "Audio Settings",
  "DAC Output",
  "Playback Queue",
  "Hi-Res Panel",
]

const flickCallouts = [
  { title: "Library View", description: "Your collection, beautifully organized. No cloud required." },
  { title: "Now Playing", description: "Minimal interface that gets out of the way." },
  { title: "Lossless Audio", description: "FLAC, ALAC, WAV, DSD — bit-perfect playback." },
  { title: "UAC 2.0 DAC", description: "USB Audio Class support up to 32-bit / 384kHz." },
  { title: "Gapless Playback", description: "Seamless album transitions. Zero silence." },
  { title: "Hi-Res Output", description: "Clean signal path to your headphones." },
]

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
        <Ecosystem />
        <DiagonalMockupShowcase
          id="latch"
          appName="Latch"
          logoSrc="/assets/logos/latch_logo.svg"
          headerLabel="// 01 — LATCH / SECURE MEDIA VAULT"
          infoText="LATCH all free / ANDROID 8+ / OPEN SOURCE"
          mockups={latchMockups}
          screenNames={latchScreenNames}
          callouts={latchCallouts}
        />
        <DiagonalMockupShowcase
          id="flick"
          appName="Flick"
          logoSrc="/assets/logos/flick_logo.svg"
          headerLabel="// 02 — FLICK / AUDIOPHILE PLAYER"
          infoText="FLICK v0.16.0-beta.1 / ANDROID 8+ / OPEN SOURCE"
          mockups={flickMockups}
          screenNames={flickScreenNames}
          callouts={flickCallouts}
        />
        <BrokenGridIntegration />
        <Ethos />
      </main>
      <Footer />
    </div>
  )
}

export default App
