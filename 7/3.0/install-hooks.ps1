$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$hooks = Join-Path $PSScriptRoot "githooks"
git -C $root config core.hooksPath (Resolve-Path $hooks)
Write-Host "Hooki: $hooks"
