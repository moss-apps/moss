# Architecture

This document describes the structure, component tree, and design patterns of the Moss ecosystem landing page.

## Overview

A single-page landing site for Moss Laboratories built with React 19, Vite 8, and TypeScript. It consists of six scrollable sections, a sticky navigation bar, an interactive canvas background, and a loading splash screen.

```
index.html  →  main.tsx  →  App.tsx
                              ├── LoadingScreen
                              ├── Navigation (sticky)
                              └── main
                                   ├── Hero
                                   ├── Ecosystem
                                   ├── DiagonalMockupShowcase (Latch)
                                   ├── DiagonalMockupShowcase (Flick)
                                   ├── BrokenGridIntegration
                                   ├── Ethos
                                   └── Footer
```

## Directory Layout

```
src/
  main.tsx                  # ReactDOM.createRoot, renders <App />
  App.tsx                   # Root component, orchestrates all sections
  index.css                 # Global styles — Tailwind directives + custom utility classes
  components/               # UI components (one per section + shared)
  components/ui/            # shadcn/ui primitives (button.tsx)
  hooks/                    # Custom React hooks
  lib/                      # Utility functions (cn() from clsx + tailwind-merge)
  shaders/                  # GLSL fragment shader source files
  stores/                   # Zustand state management
  types/                    # TypeScript type declarations (currently empty)
```

## Component Architecture

Each section is a self-contained component. Configuration data (mockup paths, screen names, callout text) lives in `App.tsx` and is passed as props — sections themselves contain no hardcoded app-specific strings.

### `LoadingScreen`
Full-screen overlay shown on first visit. Renders an SVG logo with animated metallic circles and a blinking "System Initialized" sequence. Calls `onComplete` via prop to unmount itself.

### `Navigation`
Sticky top bar (fixed, `z-50`). Features:
- Logo + "Moss" text linking to `#`
- Desktop: inline nav links (`#ecosystem`, `#latch`, `#flick`, `#integration`, `#ethos`)
- Performance mode toggle
- Accent color picker dropdown (8 colors)
- Mobile: hamburger menu → full dropdown panel
- Respects `safe-area-inset-top` for notched devices

### `Hero`
Full-viewport hero section with:
- Animated logo entrance (scale + opacity)
- "Moss" headline (gradient text, `clamp(4rem,14vw,12rem)`)
- Subheadline paragraph
- Two CTAs: "Get Flick" (Google Play) and "Join Latch Beta" (mailto)
- Version/stat meta line
- Scroll-down indicator with animated chevron

### `Ecosystem`
Three-column grid introducing the apps:
1. **Latch** — secure media vault (Shield icon)
2. **Flick Player** — audiophile music player (Music icon)
3. **Handoff** — cross-app integration (ArrowRightLeft icon)

Cards have links to the Flick site, Google Play, GitHub releases, and the Latch beta mailto. Below the cards is a connection diagram (horizontal on desktop, vertical on mobile) with animated dot indicators showing Latch ↔ Flick data flow.

### `DiagonalMockupShowcase`
The most complex component. Used twice in `App.tsx` — once for Latch, once for Flick — configured entirely via props:

```ts
interface DiagonalMockupShowcaseProps {
  id: string
  appName: string
  logoSrc: string
  headerLabel: string
  infoText: string
  mockups: string[]        // 6 SVG paths
  screenNames: string[]    // 6 screen labels
  callouts: {              // 6 tooltip descriptions
    title: string
    description: string
  }[]
}
```

Internally it uses:
- GSAP `ScrollTrigger` for scroll-pinned animation
- `useGSAP` hook from `@gsap/react` for lifecycle-safe cleanup
- A 12-column CSS grid for mockup positioning
- Diagonal staggered entrance/exit of 6 phone mockup SVGs
- Callout tooltip box that fades between items as the user scrolls
- Performance mode check — disables GSAP choreography and falls back to static CSS

### `BrokenGridIntegration`
Describes the Latch → Flick handoff workflow. Shows a 3-step sequence (Select in Latch → Secure Handoff → Play in Flick) with `BrokenGrid` visual styling.

### `Ethos`
Design principles section with:
- 3 philosophy cards: Open Source, User First, Accessible
- A manifesto quote block with dot-pattern background
- Contact email

### `Footer`
Four-column grid footer:
- Brand column (logo + description)
- Ecosystem links (same as nav anchors + external links)
- Connect links (GitHub, Email)
- Bottom bar: copyright + "All systems nominal" status indicator

## State Management

A single Zustand store (`useMossStore`) handles all UI preferences:

| State | Type | Persisted | Description |
|-------|------|-----------|-------------|
| `accent` | `AccentColor` | yes | Current theme color (teal default) |
| `performanceMode` | `boolean` | yes | Disables canvas/WebGL/GSAP |
| `reducedMotion` | `boolean` | no | Respects `prefers-reduced-motion` media query |

`setAccent()` also sets `--accent` and `--accent-hue` CSS custom properties on `document.documentElement`, allowing any component to reference the current accent via `var(--accent)`.

## Data Flow

```
useMossStore (persisted)
  ├── Navigation: reads accent, writes setAccent / setPerformanceMode
  ├── DiagonalMockupShowcase: reads performanceMode
  └── ShaderBackground: reads accent (not currently used via store)

App.tsx (static config)
  ├── mockups, screenNames, callouts → DiagonalMockupShowcase props
  └── single state: loadingComplete → LoadingScreen visibility
```

There's no routing — this is a pure single-page scroll site. Navigation uses anchor links (`#section-id`).

## Performance

Three levels of optimization:

1. **Performance mode** (user toggle) — skips GSAP choreography in `DiagonalMockupShowcase`, switches mockups to CSS-only
2. **Reduced motion** (system preference) — components can check `reducedMotion` from the store to simplify animations
3. **Lazy loading** — `ShaderBackgroundLazy.tsx` exists for deferred Three.js loading (not currently used in `App.tsx`)

## Styling Approach

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin (no PostCSS config needed)
- Custom utility classes defined in `index.css`:
  - `.glass` — backdrop-blur + border + background
  - `.glass-hover` — hover scale + brightness transitions
  - `.brutal-border-t` / `.brutal-border-b` — 1px white/10 borders
  - `.dot-pattern` — radial-gradient dot texture overlay
  - `.text-display` / `.text-label` — typography presets
- Accent color via CSS custom property `var(--accent)` set by the Zustand store
- shadcn/ui `components.json` configured with `base-nova` style

## Shaders

`src/shaders/dotField.frag` — a GLSL fragment shader used by `ShaderBackground.tsx` (Three.js plane). Renders an animated dot grid with:
- Simplex noise displacement for organic motion
- Mouse position influence (uniform `uMouse`)
- Accent color blending (uniform `uAccent`)

## Testing

- **Vitest** configured for unit tests (`tests/` — currently empty)
- **Playwright** configured for e2e tests (`e2e/` — currently empty)
- `playwright.config.ts` targets Chromium on localhost:5173
