import { Hero } from "@/components/Hero"
import { Ecosystem } from "@/components/Ecosystem"
import { DiagonalMockupShowcase } from "@/components/DiagonalMockupShowcase"
import { BrokenGridIntegration } from "@/components/BrokenGridIntegration"
import { Ethos } from "@/components/Ethos"
import { useGitHubRelease } from "@/hooks/useGitHubRelease"

const latchMockups = [
  "/assets/mockups/latch_one.png",
  "/assets/mockups/latch_two.png",
  "/assets/mockups/latch_three.png",
  "/assets/mockups/latch_four.png",
  "/assets/mockups/latch_five.png",
  "/assets/mockups/latch_six.png",
]

const flickMockups = [
  "/assets/mockups/flick_one.png",
  "/assets/mockups/flick_two.png",
  "/assets/mockups/flick_three.png",
  "/assets/mockups/flick_four.png",
  "/assets/mockups/flick_five.png",
  "/assets/mockups/flick_six.png",
]

const latchScreenNames = [
  "Lock Screen",
  "Security Settings",
  "Audio Player",
  "Gallery Vault",
  "Folder Backup",
  "More Settings",
]

const latchCallouts = [
  { title: "Lock Screen", description: "Biometric unlock with vault dashboard at a glance." },
  { title: "Security Settings", description: "Configure encryption, access rules, and threat responses." },
  { title: "Audio Player", description: "Built-in player with Flick as external output option." },
  { title: "Gallery Vault", description: "Hide photos and doubles as a folder explorer." },
  { title: "Folder Backup", description: "Automated backups with screenshot protection enabled." },
  { title: "More Settings", description: "Additional preferences and advanced configuration." },
]

const flickScreenNames = [
  "Equalizer",
  "Now Playing",
  "Library",
  "Full Screen Player",
  "UAC 2.0 Preferences",
  "Flick Replay",
]

const flickCallouts = [
  { title: "Equalizer", description: "Fine-tune your sound with precision frequency controls." },
  { title: "Now Playing", description: "Minimal interface that gets out of the way." },
  { title: "Library", description: "Your collection, beautifully organized. No cloud required." },
  { title: "Full Screen Player", description: "Immersive playback with album art and controls." },
  { title: "UAC 2.0 Preferences", description: "USB Audio Class settings up to 32-bit / 384kHz." },
  { title: "Flick Replay", description: "Revisit your listening history and favorite moments." },
]

export function Home() {
  const latchVersion = useGitHubRelease("Latch").version
  const flickVersion = useGitHubRelease("Flick").version

  const latchInfoText = latchVersion
    ? `Latch ${latchVersion} / Android 8+ / Open Source`
    : "Latch / All Free / Android 8+ / Open Source"

  const flickInfoText = flickVersion
    ? `Flick ${flickVersion} / Android 8+ / Open Source`
    : "Flick v0.16.0-beta.1 / Android 8+ / Open Source"

  return (
    <main>
      <Hero />
      <Ecosystem />
      <DiagonalMockupShowcase
        id="latch"
        appName="Latch"
        logoSrc="/assets/logos/latch_logo.svg"
        headerLabel="Latch / Secure Media Vault"
        infoText={latchInfoText}
        mockups={latchMockups}
        screenNames={latchScreenNames}
        callouts={latchCallouts}
      />
      <DiagonalMockupShowcase
        id="flick"
        appName="Flick"
        logoSrc="/assets/logos/flick_logo.svg"
        headerLabel="Flick / Audiophile Player"
        infoText={flickInfoText}
        mockups={flickMockups}
        screenNames={flickScreenNames}
        callouts={flickCallouts}
      />
      <BrokenGridIntegration />
      <Ethos />
    </main>
  )
}
