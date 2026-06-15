# Moss Ecosystem

The landing page for the **Moss Laboratories** ecosystem — a suite of open-source, privacy-first Android applications. Built with React, TypeScript, and Vite, deployed on Vercel.

**[moss-laboratories.vercel.app](https://mosslabs.vercel.app)**

---

## Apps

### [Flick Player](https://github.com/moss-apps/Flick)
Audiophile-grade music player for Android. UAC 2.0 USB DAC support, lossless playback (FLAC, ALAC, WAV, DSD), gapless transitions, and a focused listening interface.

- **Status**: Live on [Google Play](https://play.google.com/store/apps/details?id=com.mossapps.flick)
- **Version**: v0.16.0-beta.1
- **Site**: [flick-player.site](https://www.flick-player.site/)

### [Latch Secure Vault](https://github.com/moss-apps/Latch)
Encrypted media vault with AES-256, biometric unlock, decoy vault (plausible deniability), folder-based passcodes, and auto-kill triggers. Shares files to Flick via in-memory handoff.

- **Status**: Closed beta — [request access](mailto:moss_apps@proton.me?subject=Latch%20Closed%20Beta%20Access)
- **Version**: v0.14.0-beta.1
- **Releases**: [GitHub](https://github.com/moss-apps/Latch/releases)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Animation | Framer Motion, GSAP + ScrollTrigger |
| 3D / Shaders | Three.js (R3F, Drei), custom GLSL fragment shaders |
| State | Zustand (localStorage-persisted) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Getting Started

```bash
pnpm install
pnpm dev        # Start dev server at localhost:5173
pnpm build      # Type-check and production build
pnpm preview    # Serve the production build locally
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | `tsc -b && vite build` |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint across the project |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright end-to-end tests |

---

## Project Structure

```
src/
  App.tsx                    # Root component, assembles all sections
  index.css                  # Tailwind + custom brutalist/glass styles
  main.tsx                   # React mount point
  components/
    AsciiFlashlight.tsx      # Mouse-driven ASCII canvas
    BrokenGridIntegration.tsx # Cross-app handoff section
    DiagonalMockupShowcase.tsx # Scroll-pinned mockup carousel
    Ecosystem.tsx            # Apps overview section
    Ethos.tsx                # Design principles + manifesto
    Footer.tsx               # Site footer
    Hero.tsx                 # Full-viewport hero
    LoadingScreen.tsx        # Animated boot screen
    Navigation.tsx           # Sticky nav + theme picker
    ShaderBackground.tsx     # Three.js animated dot-field background
    ui/                      # shadcn/ui primitives
  hooks/                     # Custom React hooks
  lib/                       # Utilities (cn(), etc.)
  shaders/                   # GLSL fragment shaders
  stores/                    # Zustand stores
public/
  assets/                    # Logos, banners, mockups
```

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for a detailed breakdown.

---

## Design

Brutalist aesthetic with glassmorphism panels, monospace labels, hairline borders, and a metallic accent system. Interactive features include:

- **ASCII flashlight** — mouse movement reveals characters on a canvas layer
- **Shader background** — animated dot grid responding to mouse position and accent color
- **Accent color picker** — 8-color theme switcher with persistence
- **Performance mode** — toggle to disable all heavy effects for accessibility
- **Reduced motion** — respects `prefers-reduced-motion`

---

## Deployment

Deployed on Vercel with SPA rewrite rules (all routes → `index.html` except `/assets/`). The `vercel.json` handles this. Push to the connected branch to deploy automatically.

---

## Contact

**Moss Laboratories** — [moss_apps@proton.me](mailto:moss_apps@proton.me)

GitHub: [moss-apps](https://github.com/moss-apps)
