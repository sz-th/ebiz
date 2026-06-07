#!/usr/bin/env bash
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
src="$(cd "$(dirname "$0")/.github/workflows" && pwd)/pipeline.yml"
mkdir -p "$root/.github/workflows"
cp "$src" "$root/.github/workflows/ebiz-pipeline.yml"
echo "Workflow: .github/workflows/ebiz-pipeline.yml"
