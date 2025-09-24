# Scripts

This folder contains a few helper scripts used during development and troubleshooting.

## clear-next-and-build.ps1
PowerShell helper that:
- Resolves the repository root relative to the script
- Removes the `.next` directory (if present)
- Runs `npm ci` (unless `-SkipInstall` is provided)
- Runs `npm run build`

Usage (PowerShell):

```powershell
# default: remove .next, install deps, then build
.\clear-next-and-build.ps1

# Skip reinstalling dependencies (faster if node_modules is up-to-date)
.\clear-next-and-build.ps1 -SkipInstall
```

Exit codes:
- `0` - success
- `2` - failed to resolve or change to repository root
- `3` - `npm` not found in PATH
- `4` - failed to remove `.next`
- `5` - `npm ci` failed
- `6` - `npm run build` failed

If the script fails, copy the console output and share it for debugging.

---

## check-no-motion.js
A Node script that scans the repo for `framer-motion` or `motion` usage and helps locate any stray imports or JSX `motion.*` elements. Run it with:

```powershell
node .\check-no-motion.js
```

## smoke-test.js
A small runtime check that requests the local server (after `npm run start`) and verifies the homepage contains expected content. Run it with:

```powershell
# start the production server in another terminal first
npm run start
# then in this terminal
node .\smoke-test.js
```

---

## Committing changes
If you want to commit the script changes locally, run:

```powershell
git add scripts/clear-next-and-build.ps1 scripts/README.md
git commit -m "scripts: make clear-next-and-build robust; add README"
git push
```

If you want me to attempt the commit here, say so and I'll try to run git commands in the environment.
