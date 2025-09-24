# Karmic Jyotiṣa — Starter

A minimal Next.js app demonstrating:
- Gen Z / Classic / Scholar modes
- Multilingual UI (English / Hindi / Sanskrit)
- Explainable theme cards
- Mock chart builder + tiny rule engine

## Quick start
```bash
# 1) Install Node.js 18+ (https://nodejs.org)
# 2) Unzip this folder and open a terminal here
npm install
npm run dev
# open http://localhost:3000
```

> Ephemeris is mocked. Replace `lib/astro.ts` with real positions (e.g., Swiss Ephemeris or Skyfield) when ready.


## Scripts & CI

This repository includes helper scripts in the `scripts/` folder and a GitHub Actions workflow that runs a code-scan and production build on push and pull requests to `main`.

- `scripts/clear-next-and-build.ps1` — PowerShell helper to remove the `.next` directory, run `npm ci` (optional), and `npm run build`.
  - Usage (PowerShell):

```powershell
.\scripts\clear-next-and-build.ps1
# or skip reinstalling dependencies:
.\scripts\clear-next-and-build.ps1 -SkipInstall
```

- `scripts/check-no-motion.js` — scans the repository for `framer-motion` or `motion` usage to help catch stray imports or JSX elements.
  - Run with:

```powershell
node .\scripts\check-no-motion.js
```

- `scripts/smoke-test.js` — a small runtime smoke test that queries the running production server (`npm run start`) and verifies the homepage contains expected content.

CI workflow: `.github/workflows/build-and-check.yml` performs the following on pushes and PRs to `main`:
1. Checkout repository
2. Install dependencies (`npm ci`)
3. Run `node ./scripts/check-no-motion.js`
4. Run `npm run build`

If you push this repository to GitHub, the workflow will run automatically. To adjust branches or add caching, I can update the workflow file for you.
