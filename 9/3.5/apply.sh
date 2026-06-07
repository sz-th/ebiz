#!/usr/bin/env bash
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
overlay="$(cd "$(dirname "$0")/overlay" && pwd)"

cp "$overlay/3/app/build.gradle.kts" "$root/3/app/build.gradle.kts"
cp "$overlay/3/app/src/main/kotlin/bot/App.kt" "$root/3/app/src/main/kotlin/bot/App.kt"
cp "$overlay/3/README.md" "$root/3/README.md"

echo "Most GPT + frontend: 3 (Kotlin bridge), 9/frontend, 9/gpt_service"
