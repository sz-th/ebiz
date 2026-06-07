$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$overlay = Join-Path $PSScriptRoot "overlay\e2e"
$e2e = Join-Path $root "6\e2e"
Copy-Item (Join-Path $overlay "cypress.config.js") $e2e -Force
Copy-Item (Join-Path $PSScriptRoot "browserstack.json") $e2e -Force
$src = Join-Path $PSScriptRoot ".github\workflows\pipeline.yml"
$dstDir = Join-Path $root ".github\workflows"
New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
Copy-Item $src (Join-Path $dstDir "ebiz-pipeline.yml") -Force
Write-Host "Konfiguracja E2E: 6/e2e"
Write-Host "Workflow (BrowserStack): .github/workflows/ebiz-pipeline.yml"
