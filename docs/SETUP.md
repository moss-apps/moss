# Setup & Deployment

## Prerequisites

- **Node.js** 20.19+ or 22.12+ (Vite 8 requirement)
- **pnpm** (lockfile is `pnpm-lock.yaml`)
- A Vercel account (for deployment)

## Local Development

```bash
# Clone and install
git clone https://github.com/moss-apps/moss.git
cd moss
pnpm install

# Start dev server
pnpm dev
```

The dev server runs at `http://localhost:5173` with HMR enabled.

## Available Commands

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Type-check (`tsc -b`) then production build (`vite build`) |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint across the project |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:ui` | Vitest with browser UI |
| `pnpm test:e2e` | Playwright end-to-end tests |
| `pnpm test:e2e:ui` | Playwright with browser UI |

## Environment Variables

The site renders without environment variables, but the announcements feed and
admin editor require a Supabase project. Client-exposed values are prefixed with
`VITE_`; everything else is server-only (Vercel functions in `api/`). See
`.env.example` for the full list.

## Adding a New Section

1. Create the component in `src/components/YourSection.tsx`
2. Import and render it in `src/pages/Home.tsx` (the landing route)
3. Give the section an `id` attribute for anchor linking
4. Add a corresponding link in `Navigation.tsx` if it should appear in the nav

## Adding a New Route

1. Create the page in `src/pages/YourPage.tsx`
2. Add it to the route table in `src/main.tsx` (inside the `Layout` route)
3. Add the path to `src/lib/routes.ts` so the edge middleware treats it as known
4. Add the URL to `public/sitemap.xml` unless the page should be `noindex`

## Customizing Content

App-specific content (mockup paths, screen names, callout text, links) lives in
`src/lib/apps.ts` and feeds both the home page and the `/flick` + `/latch`
product pages. Section components under `src/components/` contain the layout.
Static assets live in `public/assets/`; to update app screenshots, replace the
PNGs in `public/assets/mockups/`.

## Accent Colors

The 8 accent options are defined in `src/stores/useMossStore.ts`. To add a new color:

1. Add it to the `AccentColor` type union
2. Add an entry to `accentMap` with `hex` and `hue` values
3. Add a corresponding entry in both desktop and mobile accent pickers in `Navigation.tsx`

## Deployment

### Vercel (current setup)

The site is deployed to Vercel at `mosslabs.vercel.app`. Configuration:

- **Framework**: Vite
- **Build command**: `pnpm build` (or auto-detected)
- **Output directory**: `dist`
- **SPA rewrites**: Handled by `vercel.json` — all routes redirect to `index.html` except `/assets/`
- **Edge middleware**: `middleware.ts` returns a real `404` status for paths not listed in `src/lib/routes.ts`, while still serving the SPA shell (so the `NotFound` page renders)

To deploy your own instance:

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

A push to the connected Git branch triggers automatic deployment.

### Static hosting (any provider)

```bash
pnpm build
# Serve the dist/ directory with any static file server
# Make sure SPA fallback is configured (all routes → index.html)
```

> Edge middleware (real 404 status) only runs on Vercel. On other static hosts,
> unknown routes still render the `NotFound` page but respond with HTTP 200.

## Assets

Mockups and logos live in `public/assets/`. To replace them:

- **Logos**: `public/assets/logos/` — `flick_logo.svg`, `latch_logo.svg`
- **Brand**: `public/assets/` — `moss_logo.svg`, `mosslogo.png`
- **Mockups**: `public/assets/mockups/` — `flick_one.png` through `flick_six.png`, `latch_one.png` through `latch_six.png`
- **Banners**: `public/assets/` — `flick_banner.png`, `latch_banner.png`

Mockup dimensions should be consistent (currently ~412×892px at 1x for phone frames).
