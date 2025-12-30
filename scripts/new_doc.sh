#!/usr/bin/env bash
# Scaffold a new doc JSON under projects/doc-site/data/docs
# Usage: scripts/new_doc.sh <category> <slug>
# Example: scripts/new_doc.sh guides quickstart
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <category> <slug>" >&2
  exit 1
fi

CATEGORY=$1
SLUG=$2
ROOT=$(cd "$(dirname "$0")/.." && pwd)
DOCS_DIR="$ROOT/projects/doc-site/data/docs/$CATEGORY"
TARGET="$DOCS_DIR/$SLUG.json"

mkdir -p "$DOCS_DIR"
if [ -f "$TARGET" ]; then
  echo "File already exists: $TARGET" >&2
  exit 1
fi

cat > "$TARGET" <<'JSON'
{
  "id": "__CATEGORY__.__SLUG__",
  "version": "v2.0.0",
  "category": "__CATEGORY__",
  "title": "REPLACE ME",
  "tags": [],
  "content": "REPLACE ME",
  "links": [],
  "items": [
    {"id": "ITEM-1", "title": "", "why": "", "what": "", "how": ""}
  ]
}
JSON

# Replace placeholders
perl -pi -e "s/__CATEGORY__/$CATEGORY/g; s/__SLUG__/$SLUG/g" "$TARGET"

echo "Created: $TARGET"
