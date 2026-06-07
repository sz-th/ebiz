$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$src = Join-Path $PSScriptRoot ".github\workflows\pipeline.yml"
$dstDir = Join-Path $root ".github\workflows"
New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
Copy-Item $src (Join-Path $dstDir "ebiz-pipeline.yml") -Force
Write-Host "Workflow: .github/workflows/ebiz-pipeline.yml"
