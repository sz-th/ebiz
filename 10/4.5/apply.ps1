$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$overlay = Join-Path $PSScriptRoot "overlay\client"
$client = Join-Path $root "5\client"
Copy-Item (Join-Path $overlay "nginx.conf") $client -Force
Copy-Item (Join-Path $overlay "Dockerfile") $client -Force
Copy-Item (Join-Path $overlay "src\api.js") (Join-Path $client "src") -Force
$src = Join-Path $PSScriptRoot ".github\workflows\pipeline.yml"
$dstDir = Join-Path $root ".github\workflows"
New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
Copy-Item $src (Join-Path $dstDir "ebiz-pipeline.yml") -Force
Write-Host "Overlay klienta (nginx proxy): 5/client"
Write-Host "Workflow (deploy): .github/workflows/ebiz-pipeline.yml"
