#!/usr/bin/env bash
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
overlay="$(cd "$(dirname "$0")/overlay/e2e" && pwd)"
cp "$overlay/cypress.config.js" "$root/6/e2e/cypress.config.js"
cp "$(dirname "$0")/browserstack.json" "$root/6/e2e/browserstack.json"
src="$(cd "$(dirname "$0")/.github/workflows" && pwd)/pipeline.yml"
mkdir -p "$root/.github/workflows"
cp "$src" "$root/.github/workflows/ebiz-pipeline.yml"
echo "Konfiguracja E2E: 6/e2e"
echo "Workflow (BrowserStack): .github/workflows/ebiz-pipeline.yml"
