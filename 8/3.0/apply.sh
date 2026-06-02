#!/bin/sh
set -e
root="$(git rev-parse --show-toplevel)"
overlay="$(cd "$(dirname "$0")/overlay" && pwd)"
client="$root/5/client"
cp "$overlay/package.json" "$client/"
cp "$overlay/eslint.config.js" "$client/"
mkdir -p "$client/.husky"
cp "$overlay/.husky/pre-commit" "$client/.husky/pre-commit"
chmod +x "$client/.husky/pre-commit" 2>/dev/null || true
cd "$client"
npm install
echo "Husky + lint-staged: 5/client"
