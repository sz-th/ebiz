$ErrorActionPreference = "Stop"
$root = git rev-parse --show-toplevel
if (-not $root) {
  Write-Error "Uruchom w katalogu repozytorium git."
  exit 1
}
$base = $PSScriptRoot
$overlay = Join-Path $base "overlay"
$config = Join-Path $base "config"

Copy-Item (Join-Path $overlay "1\4.5\src\main\kotlin\Main.kt") (Join-Path $root "1\4.5\src\main\kotlin\Main.kt") -Force
Copy-Item (Join-Path $overlay "4\main.go") (Join-Path $root "4\main.go") -Force
Copy-Item (Join-Path $overlay "4\README.md") (Join-Path $root "4\README.md") -Force
Copy-Item (Join-Path $overlay "3\app\src\main\kotlin\bot\App.kt") (Join-Path $root "3\app\src\main\kotlin\bot\App.kt") -Force
Copy-Item (Join-Path $overlay "3\README.md") (Join-Path $root "3\README.md") -Force
Copy-Item (Join-Path $overlay "6\api\tests\client.js") (Join-Path $root "6\api\tests\client.js") -Force
Copy-Item (Join-Path $overlay "6\api\README.md") (Join-Path $root "6\api\README.md") -Force

Copy-Item (Join-Path $config "3\sonar-project.properties") (Join-Path $root "3\sonar-project.properties") -Force
Copy-Item (Join-Path $config "4\sonar-project.properties") (Join-Path $root "4\sonar-project.properties") -Force
Copy-Item (Join-Path $config "6\api\sonar-project.properties") (Join-Path $root "6\api\sonar-project.properties") -Force
Copy-Item (Join-Path $config "6\unit\sonar-project.properties") (Join-Path $root "6\unit\sonar-project.properties") -Force

Write-Host "Code smells + Sonar: 1/4.5, 3, 4, 6/api, 6/unit"
