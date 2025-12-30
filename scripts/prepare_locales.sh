#!/usr/bin/env bash
# Scaffold locale folders for doc-site and seed `en` by copying canonical docs
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DATA="$REPO_ROOT/projects/doc-site/data"
LOCALES_DIR="$PROJECT_DATA/locales"

if [ -z "$1" ]; then
  echo "Usage: $0 <locale-id>" >&2
  echo "Example: $0 en" >&2
  exit 2
fi

LOCALE=$1

mkdir -p "$LOCALES_DIR/$LOCALE/docs"

# If seeding English, copy existing docs/ into locales/en/docs
if [ "$LOCALE" = "en" ]; then
  if [ -d "$PROJECT_DATA/docs" ]; then
    echo "Seeding English locale by copying existing docs..."
    rsync -a --delete "$PROJECT_DATA/docs/" "$LOCALES_DIR/$LOCALE/docs/"
    # Copy manifest if present
    if [ -f "$PROJECT_DATA/docs-manifest.json" ]; then
      cp "$PROJECT_DATA/docs-manifest.json" "$LOCALES_DIR/$LOCALE/docs-manifest.json"
    fi
  else
    echo "No canonical docs found at $PROJECT_DATA/docs" >&2
    exit 1
  fi
else
  echo "Created locale skeleton: $LOCALES_DIR/$LOCALE/docs/"
fi

echo "Done. Edit $LOCALES_DIR/$LOCALE/docs/ and $LOCALES_DIR/$LOCALE/docs-manifest.json to add translations."
