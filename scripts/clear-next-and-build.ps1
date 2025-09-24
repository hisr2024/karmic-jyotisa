<#
PowerShell helper: safely remove the `.next` build directory, run `npm ci` (optional), and `npm run build`.

Usage:
  .\clear-next-and-build.ps1             # default: remove .next, run npm ci, then npm run build
  .\clear-next-and-build.ps1 -SkipInstall  # skip `npm ci` and only run the build

This script is intended for Windows PowerShell (tested on PowerShell 5.1 and PowerShell 7+).
#>

param(
	[switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host $msg -ForegroundColor Cyan }
function Write-Success($msg) { Write-Host $msg -ForegroundColor Green }
function Write-Warn($msg) { Write-Warning $msg }
function Write-Err($msg) { Write-Host $msg -ForegroundColor Red }

try {
	# Determine repository root (parent folder of this script)
	$scriptFolder = Split-Path -Parent $MyInvocation.MyCommand.Definition
	$repoRoot = Resolve-Path (Join-Path $scriptFolder '..') | Select-Object -ExpandProperty Path
	Write-Info "Repository root resolved to: $repoRoot"
	Set-Location $repoRoot
} catch {
	Write-Err "Failed to resolve or change to repository root: $_"
	exit 2
}

# Ensure package.json is present (sanity check)
if (-not (Test-Path -Path (Join-Path $repoRoot 'package.json'))) {
	Write-Warn "Warning: no package.json found in repository root ($repoRoot). Are you in the right folder?"
}

# Check npm availability
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
	Write-Err "npm was not found in PATH. Please install Node.js (which includes npm) and ensure it's on the PATH."
	exit 3
}

$nextDir = Join-Path $repoRoot '.next'
if (Test-Path -Path $nextDir) {
	Write-Info "Removing existing .next directory: $nextDir"
	try {
		Remove-Item -LiteralPath $nextDir -Recurse -Force -ErrorAction Stop
		Write-Success ".next removed successfully."
	} catch {
		Write-Err "Failed to remove .next. If files are in use, stop any running Next.js process and try again. Error: $_"
		exit 4
	}
} else {
	Write-Info ".next directory does not exist; skipping removal."
}

if (-not $SkipInstall) {
	Write-Info "Installing dependencies with 'npm ci'..."
	try {
		& npm ci
		if ($LASTEXITCODE -ne 0) {
			Write-Err "'npm ci' failed with exit code $LASTEXITCODE"
			exit $LASTEXITCODE
		}
		Write-Success "Dependencies installed (npm ci)"
	} catch {
		Write-Err "Error running 'npm ci': $_"
		exit 5
	}
} else {
	Write-Info "Skipping 'npm ci' because -SkipInstall was passed."
}

Write-Info "Running production build: 'npm run build'..."
try {
	& npm run build
	if ($LASTEXITCODE -ne 0) {
		Write-Err "'npm run build' failed with exit code $LASTEXITCODE"
		exit $LASTEXITCODE
	}
	Write-Success "Build finished successfully."
} catch {
	Write-Err "Build failed: $_"
	exit 6
}

exit 0
