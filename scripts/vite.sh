#!/usr/bin/env bash
# NTFS/fuseblk volumes often refuse +x on binaries. Copy esbuild to /tmp first.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/node_modules/esbuild/bin/esbuild"
DST="/tmp/esbuild-thoghour-$$"
if [[ -f "$SRC" ]]; then
  cp "$SRC" "$DST"
  chmod +x "$DST"
  export ESBUILD_BINARY_PATH="$DST"
  trap 'rm -f "$DST"' EXIT
fi
exec node "$ROOT/node_modules/vite/bin/vite.js" "$@"
