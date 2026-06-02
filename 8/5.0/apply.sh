#!/bin/sh
set -e
root="$(git rev-parse --show-toplevel)"
src="$(cd "$(dirname "$0")/.github/workflows" && pwd)"
dst="$root/.github/workflows"
mkdir -p "$dst"
cp "$src/lint.yml" "$dst/"
cp "$src/codeql.yml" "$dst/"
if [ -f "$root/8/4.0/.github/workflows/codeql-oss.yml" ]; then
  cp "$root/8/4.0/.github/workflows/codeql-oss.yml" "$dst/"
fi
echo "Workflows: .github/workflows"
