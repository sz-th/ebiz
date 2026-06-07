#!/usr/bin/env bash
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
overlay="$(cd "$(dirname "$0")/overlay/client" && pwd)"
cp "$overlay/Dockerfile" "$root/5/client/Dockerfile"
echo "Dockerfile klienta (VITE_API_URL build arg): 5/client/Dockerfile"
