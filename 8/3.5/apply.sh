#!/bin/sh
set -e
root="$(git rev-parse --show-toplevel)"
overlay="$(cd "$(dirname "$0")/overlay/src/components" && pwd)"
cp "$overlay"/*.jsx "$root/5/client/src/components/"
echo "Poprawki Sonar (bugi klienta): 5/client/src/components"
