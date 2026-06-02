$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$overlay = Join-Path $PSScriptRoot "overlay\src"
$dst = Join-Path $root "5\client\src"
Copy-Item (Join-Path $overlay "components\*") (Join-Path $dst "components") -Force
Write-Host "Poprawki Sonar (bugi klienta): 5/client/src/components"
