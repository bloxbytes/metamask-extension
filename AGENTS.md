# Repository Guidelines

## Project Structure & Module Organization
- `app/`: background scripts, controllers, and extension bootstrapping.
- `ui/`: React views/components and styling (SCSS/Tailwind).
- `shared/`, `types/`: cross-cutting utilities, constants, and type definitions.
- `test/`: unit, integration, Playwright/Selenium e2e helpers and fixtures.
- `development/`, `lavamoat/`: build tooling, webpack configs, LavaMoat policies.
- `docs/`, `builds/`, `dist/`: contributor docs and build outputs (checked artifacts only when intended).

## Build, Test, and Development Commands
- Install: `corepack enable && yarn install` (Node 20.12–20.14 or ≥20.17, Yarn 4.9+).
- Dev watch: `yarn start` builds MV3 dev bundle; `yarn start:mv2` for MV2.
- Package: `yarn build` (LavaMoat-protected) or `yarn dist` for distributable zips.
- Lint baseline: `yarn lint` or `yarn lint:fix` to auto-fix.
- Tests: `yarn test` (lint + unit), `yarn test:integration`, `yarn test:e2e:chrome`, `yarn test:e2e:swap` (Playwright project), `yarn storybook` for UI review.

## Coding Style & Naming Conventions
- Two-space indentation; TypeScript/JavaScript with JSX; prefer TypeScript when adding new modules.
- Prettier enforces formatting; ESLint (MetaMask configs) guards standards; Stylelint covers SCSS; `tsc` must stay clean.
- Components and classes use `PascalCase`; hooks/functions use `camelCase`; SCSS modules match component or feature folder names.
- Keep modules focused; prefer colocated tests and stories next to implementation when practical.

## Testing Guidelines
- Unit tests: Jest (`*.test.ts[x]`, `*.test.js`) near source or under `test/unit`; use Testing Library for React pieces.
- Integration: `yarn test:integration` bundles fixtures first—run after touching build or background wiring.
- E2E: `yarn test:e2e:chrome` (Selenium) or Playwright projects; ensure browsers/drivers installed locally.
- Add coverage when changing logic; include mocks/fixtures in `test/e2e/mock-*` or feature folders.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages (e.g., `Fix token list sync`, `Add swap e2e coverage`); keep commits scoped.
- Before opening a PR: run `yarn lint` and relevant tests; update docs or changelog entries when user-facing.
- PRs should describe intent, risk, and test evidence; attach screenshots or recordings for UI changes; link issues/feature flags when applicable.
- Highlight any config changes (LavaMoat policies, webpack, permissions) in the PR body.

## Security & Configuration Tips
- Do not commit secrets or real keys; use `.env`/sample placeholders and mock data.
- Changes under `lavamoat/`, permission manifests, or build configs require reviewers to re-run `yarn lavamoat:build` or `yarn build` locally.
- Keep third-party diffs minimal; prefer existing patterns for network, wallet, and controller logic to avoid regressions.
