$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$overlay = Join-Path $PSScriptRoot "overlay"

Copy-Item (Join-Path $overlay "3\app\build.gradle.kts") (Join-Path $root "3\app\build.gradle.kts") -Force
Copy-Item (Join-Path $overlay "3\app\src\main\kotlin\bot\App.kt") (Join-Path $root "3\app\src\main\kotlin\bot\App.kt") -Force
Copy-Item (Join-Path $overlay "3\README.md") (Join-Path $root "3\README.md") -Force

Write-Host "Most GPT + frontend: 3 (Kotlin bridge), 9/frontend, 9/gpt_service"
