$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$src = Join-Path $PSScriptRoot ".github\workflows"
$dst = Join-Path $root ".github\workflows"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item (Join-Path $src "lint.yml") $dst -Force
Copy-Item (Join-Path $src "codeql.yml") $dst -Force
$codeqlOss = Join-Path $root "8\4.0\.github\workflows\codeql-oss.yml"
if (Test-Path $codeqlOss) {
  Copy-Item $codeqlOss $dst -Force
}
Write-Host "Workflows: .github/workflows (lint.yml, codeql.yml, codeql-oss.yml)"
