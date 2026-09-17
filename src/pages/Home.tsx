import { Hero } from "@/components/Hero"
import { Ecosystem } from "@/components/Ecosystem"
import { DiagonalMockupShowcase } from "@/components/DiagonalMockupShowcase"
import { BrokenGridIntegration } from "@/components/BrokenGridIntegration"
import { Ethos } from "@/components/Ethos"
import { useGitHubRelease } from "@/hooks/useGitHubRelease"
import { APPS } from "@/lib/apps"

export function Home() {
  const latchVersion = useGitHubRelease("Latch").version
  const flickVersion = useGitHubRelease("Flick").version

  const latchInfoText = latchVersion
    ? `Latch ${latchVersion} / Android 8+ / Open Source`
    : "Latch / All Free / Android 8+ / Open Source"

  const flickInfoText = flickVersion
    ? `Flick ${flickVersion} / Android 8+ / Open Source`
    : "Flick v0.16.0-beta.1 / Android 8+ / Open Source"

  const { latch, flick } = APPS

  return (
    <main>
      <Hero />
      <Ecosystem />
      <DiagonalMockupShowcase
        id="latch"
        appName={latch.name}
        logoSrc={latch.logo}
        headerLabel={`${latch.name} / ${latch.tagline}`}
        infoText={latchInfoText}
        mockups={latch.mockups}
        screenNames={latch.screenNames}
        callouts={latch.callouts}
      />
      <DiagonalMockupShowcase
        id="flick"
        appName={flick.name}
        logoSrc={flick.logo}
        headerLabel={`${flick.name} / ${flick.tagline}`}
        infoText={flickInfoText}
        mockups={flick.mockups}
        screenNames={flick.screenNames}
        callouts={flick.callouts}
      />
      <BrokenGridIntegration />
      <Ethos />
    </main>
  )
}
