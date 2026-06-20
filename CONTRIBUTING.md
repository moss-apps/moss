# Contributing to Moss

Thanks for your interest in improving the Moss ecosystem site. This repo holds the landing page; the Android apps live in their own repositories ([Flick](https://github.com/moss-apps/Flick), [Latch](https://github.com/moss-apps/Latch)).

## Setup

See [docs/SETUP.md](docs/SETUP.md) for prerequisites and local development. Short version:

```bash
pnpm install
pnpm dev
```

## Before you open a PR

1. **Lint and type-check pass:**
   ```bash
   pnpm lint
   pnpm build   # runs tsc -b && vite build
   ```
2. **Keep diffs focused** — one concern per PR.
3. **Don't bump version or dependency ranges** unless that's the point of the PR.
4. **Commit messages** — imperative subject line (e.g. "Add accent-color persistence to mobile nav").

## Branching

Fork the repo and open a PR against the default branch. Use a descriptive branch name (e.g. `fix/nav-flicker`, `feat/downloads-page`).

## Style

- Follow existing conventions (enforced by ESLint + the TypeScript config).
- Prefer patterns already in `src/components/` and `src/hooks/`.
- No new dependencies without justification — check whether the standard library or an already-installed package covers it first.

## Security

Found a vulnerability? Follow [SECURITY.md](./SECURITY.md) — **do not** open a public issue.

## License

By contributing, you agree your contributions will be licensed under [AGPL-3.0-or-later](./LICENSE).
