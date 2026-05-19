#!/bin/sh
set -e
root="$(git rev-parse --show-toplevel)"
hooks="$(cd "$(dirname "$0")/githooks" && pwd)"
git -C "$root" config core.hooksPath "$hooks"
echo "Hooki: $hooks"
