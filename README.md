<div align="center">
  <img src="public/assets/mosslogo.png" alt="Moss" width="120" />
</div>

# Moss Ecosystem

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-149eca.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vite.dev)

The landing page for the **Moss Laboratories** ecosystem — a suite of open-source, privacy-first Android applications. Built with React, TypeScript, and Vite, deployed on Vercel.

**[mosslabs.vercel.app](https://mosslabs.vercel.app)**

---

## Apps

### [Flick Player](https://github.com/moss-apps/Flick)
Audiophile-grade music player for Android. UAC 2.0 USB DAC support, lossless playback (FLAC, ALAC, WAV, DSD), gapless transitions, and a focused listening interface.

- **Status**: Live on [Google Play](https://play.google.com/store/apps/details?id=com.mossapps.flick)
- **Version**: [![GitHub Release](https://img.shields.io/github/v/release/moss-apps/Flick?label=version)](https://github.com/moss-apps/Flick/releases/latest)
- **Site**: [flick-player.site](https://www.flick-player.site/)

### [Latch Secure Vault](https://github.com/moss-apps/Latch)
Encrypted media vault with AES-256, biometric unlock, decoy vault (plausible deniability), folder-based passcodes, and auto-kill triggers. Shares files to Flick via in-memory handoff.

- **Status**: Live on [Google Play](https://play.google.com/store/apps/details?id=com.mossapps.locker)
- **Version**: [![GitHub Release](https://img.shields.io/github/v/release/moss-apps/Latch?label=version)](https://github.com/moss-apps/Latch/releases/latest)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Animation | Framer Motion, GSAP + ScrollTrigger |
| 3D / Shaders | Three.js (R3F, Drei), custom GLSL fragment shaders |
| State | Zustand (localStorage-persisted) |
| Data fetching | SWR (GitHub Releases API) |
| Forms & validation | React Hook Form + Zod |
| Markdown | react-markdown + remark-gfm |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+ (Vite 8 requirement)
- **pnpm** (the lockfile is `pnpm-lock.yaml`)
- **Git**

### Install & run

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
| `pnpm test:ui` | Vitest with browser UI |
| `pnpm test:e2e` | Playwright end-to-end tests |
| `pnpm test:e2e:ui` | Playwright with interactive UI |

> The `tests/` and `e2e/` directories are scaffolded but not yet populated —
> the test runners are wired up, suites are pending.

---

## Project Structure

A single-page entry that mounts a `BrowserRouter` with three routes
(`src/main.tsx`):

```
src/
  main.tsx                    # React mount + route definitions (BrowserRouter)
  index.css                   # Tailwind + custom brutalist/glass styles
  pages/
    Home.tsx                  # Landing — assembles all sections
    Downloads.tsx             # App download links
    Changelog.tsx             # GitHub releases feed (react-markdown)
  components/
    Layout.tsx                # Route shell: nav + <Outlet/> + footer + boot screen
    Navigation.tsx            # Sticky nav + accent/theme picker
    Hero.tsx                  # Full-viewport hero
    Ecosystem.tsx             # Apps overview section
    AppShowcase.tsx           # Flick + Latch feature grid (live release data)
    BentoSpine.tsx            # Bento-grid staggered section
    Integration.tsx           # Cross-app integration section
    BrokenGridIntegration.tsx # Broken-grid handoff section
    DiagonalMockupShowcase.tsx # Scroll-pinned mockup carousel
    MockupLoader.tsx          # Animated mockup placeholder
    Ethos.tsx                 # Design principles + manifesto
    ShaderBackground.tsx      # Three.js animated dot-field background
    ShaderBackgroundLazy.tsx  # Lazy-loaded shader background (code-split)
    LoadingScreen.tsx         # Animated boot screen
    Footer.tsx                # Site footer
    ui/                       # shadcn/ui primitives
  hooks/
    useGitHubRelease.ts       # Single release fetch (SWR)
    useGitHubReleases.ts      # Release list fetch (SWR)
    useIsMobile.ts            # Viewport breakpoint hook
  lib/
    utils.ts                  # cn() class-merge helper
  shaders/
    dotField.frag             # GLSL fragment shader
  stores/
    useMossStore.ts           # Zustand store (accent color + prefs, persisted)
public/
  favicon.svg
  assets/                     # Logos, banners, mockups
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a detailed breakdown and
[docs/SETUP.md](docs/SETUP.md) for setup, customization, and deployment notes.

---

## Design

Brutalist aesthetic with glassmorphism panels, monospace labels, hairline borders, and a metallic accent system. Interactive features include:

- **Shader background** — animated dot grid responding to mouse position and accent color
- **Accent color picker** — 8-color theme switcher with persistence
- **Performance mode** — toggle to disable all heavy effects for accessibility
- **Reduced motion** — respects `prefers-reduced-motion`

---

## Roadmap

- **Ecosystem growth** — expand the Moss suite beyond Flick and Latch.
- **Deeper cross-app handoffs** — extend in-memory integration between apps.

_Edit this list as priorities firm up._

---

## Contributing

PRs are welcome against the default branch. Before opening one:

```bash
pnpm lint
pnpm build   # type-checks via tsc -b
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch conventions and the local setup walkthrough.

---

## Security

This ecosystem is privacy-first. If you find a vulnerability, **do not open a public issue** — report it privately per [SECURITY.md](./SECURITY.md) or email [moss_apps@proton.me](mailto:moss_apps@proton.me).

---

## Acknowledgements

Built on [React](https://react.dev), [Vite](https://vite.dev), [Three.js / React Three Fiber](https://r3f.docs.pmnd.rs), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com), [Zustand](https://github.com/pmndrs/zustand), [SWR](https://swr.vercel.app), [React Router](https://reactrouter.com), and [Lucide](https://lucide.dev). Typography: DM Sans + JetBrains Mono via Google Fonts.

---

## License

Source code is licensed under the **GNU Affero General Public License v3.0 or later** ([AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0.en.html)). See [LICENSE](./LICENSE). The `license` field in `package.json` carries the matching SPDX identifier.

---

## Deployment

Deployed on Vercel at [mosslabs.vercel.app](https://mosslabs.vercel.app) with SPA rewrite rules (all routes → `index.html` except `/assets/`). The `vercel.json` handles this. A push to the connected branch deploys automatically.

---

## Contact

**Moss Laboratories** — [moss_apps@proton.me](mailto:moss_apps@proton.me)

GitHub: [moss-apps](https://github.com/moss-apps)
