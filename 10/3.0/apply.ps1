$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$overlay = Join-Path $PSScriptRoot "overlay\client"
$dst = Join-Path $root "5\client"
Copy-Item (Join-Path $overlay "Dockerfile") $dst -Force
Write-Host "Dockerfile klienta (VITE_API_URL build arg): 5/client/Dockerfile"
