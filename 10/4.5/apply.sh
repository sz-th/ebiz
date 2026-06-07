#!/usr/bin/env bash
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
overlay="$(cd "$(dirname "$0")/overlay/client" && pwd)"
cp "$overlay/nginx.conf" "$root/5/client/nginx.conf"
cp "$overlay/Dockerfile" "$root/5/client/Dockerfile"
cp "$overlay/src/api.js" "$root/5/client/src/api.js"
src="$(cd "$(dirname "$0")/.github/workflows" && pwd)/pipeline.yml"
mkdir -p "$root/.github/workflows"
cp "$src" "$root/.github/workflows/ebiz-pipeline.yml"
echo "Overlay klienta (nginx proxy): 5/client"
echo "Workflow (deploy): .github/workflows/ebiz-pipeline.yml"
