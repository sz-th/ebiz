$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$overlay = Join-Path $PSScriptRoot "overlay"
$client = Join-Path $root "5\client"
Copy-Item (Join-Path $overlay "package.json") $client -Force
Copy-Item (Join-Path $overlay "eslint.config.js") $client -Force
$huskyDst = Join-Path $client ".husky"
New-Item -ItemType Directory -Force -Path $huskyDst | Out-Null
Copy-Item (Join-Path $overlay ".husky\pre-commit") (Join-Path $huskyDst "pre-commit") -Force
Push-Location $client
npm install
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }
Pop-Location
Write-Host "Husky + lint-staged: 5/client (commit z katalogu 5/client aby uruchomic hook)"
