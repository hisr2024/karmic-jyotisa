<#
.SYNOPSIS
Lightweight PowerShell file watcher for Next.js projects.

.DESCRIPTION
Watches the repository (default: parent of this script) for changes to source files
and runs `node ./scripts/check-no-motion.js` followed by `npm run build` when files
change. It excludes `node_modules`, `.git`, and the `scripts` directory by default
to avoid self-triggering.

.PARAMETER Path
Override the path to watch. Defaults to the repository root (one level up).

.EXAMPLE
PS> .\watch-and-check.ps1

.EXAMPLE
PS> .\watch-and-check.ps1 -Path '..' -DebounceMs 500

#>
param(
    [string]$Path = (Join-Path $PSScriptRoot '..'),
    [int]$DebounceMs = 800,
    [string[]]$Exclude = @('node_modules','\.git','scripts'),
    [switch]$RunOnStart
)

Set-StrictMode -Version Latest

function Resolve-WatchPath {
    param($p)
    try {
        $full = (Resolve-Path -LiteralPath $p).Path
        return $full
    } catch {
        Write-Error "Failed to resolve watch path: $p"
        exit 2
    }
}

$watchPath = Resolve-WatchPath $Path
Write-Host "Watching path: $watchPath"

# Build a regex to ignore excluded paths
$excludePattern = ($Exclude | ForEach-Object { [Regex]::Escape($_) }) -join '|'
if ($excludePattern -ne '') {
    $excludeRegex = [Regex]::new($excludePattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
} else {
    $excludeRegex = $null
}

$fsw = New-Object System.IO.FileSystemWatcher $watchPath -Property @{IncludeSubdirectories = $true; NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, DirectoryName'}

$timer = $null
function Trigger-Run {
    if ($timer) {
        $timer.Stop()
        $timer.Dispose()
        $timer = $null
    }
    $timer = New-Object Timers.Timer $DebounceMs
    $timer.AutoReset = $false
    $timer.add_Elapsed({
        Write-Host "Change detected; running checks..." -ForegroundColor Cyan
        try {
            # Run the repo scanner first
            Write-Host "Running: node ./scripts/check-no-motion.js" -ForegroundColor Yellow
            & node ./scripts/check-no-motion.js
            $scannerExit = $LASTEXITCODE
        } catch {
            Write-Host "Error running checker: $_" -ForegroundColor Red
            $scannerExit = 1
        }

        if ($scannerExit -ne 0) {
            Write-Host "check-no-motion.js reported issues (exit code $scannerExit). Skipping build." -ForegroundColor Red
            return
        }

        Write-Host "Running: npm run build" -ForegroundColor Yellow
        try {
            npm run build
            $buildExit = $LASTEXITCODE
        } catch {
            Write-Host "Build command failed: $_" -ForegroundColor Red
            $buildExit = 1
        }

        if ($buildExit -eq 0) {
            Write-Host "Build succeeded" -ForegroundColor Green
        } else {
            Write-Host "Build failed (exit code $buildExit)" -ForegroundColor Red
        }
    })
    $timer.Start()
}

Register-ObjectEvent $fsw 'Changed' -Action {
    param($sender, $e)
    if ($e.ChangeType -eq [IO.WatcherChangeTypes]::Changed -or $e.ChangeType -eq [IO.WatcherChangeTypes]::Created -or $e.ChangeType -eq [IO.WatcherChangeTypes]::Renamed) {
        if ($excludeRegex -and $excludeRegex.IsMatch($e.FullPath)) {
            return
        }
        Trigger-Run
    }
}

Register-ObjectEvent $fsw 'Created' -Action { Trigger-Run }
Register-ObjectEvent $fsw 'Deleted' -Action { Trigger-Run }
Register-ObjectEvent $fsw 'Renamed' -Action { Trigger-Run }

if ($RunOnStart) { Trigger-Run }

Write-Host "Press Ctrl+C to stop watching..." -ForegroundColor DarkCyan
try {
    while ($true) { Start-Sleep -Seconds 60 }
} finally {
    $fsw.EnableRaisingEvents = $false
    Unregister-Event -SourceIdentifier * -ErrorAction SilentlyContinue
}
