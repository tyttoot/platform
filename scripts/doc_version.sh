#!/bin/bash
# scripts/doc_version.sh - Create git tag and update HISTORY.md

set -e

TAG="$1"
MESSAGE="${2:-Version $TAG}"

if [ -z "$TAG" ]; then
  echo "Usage: $0 <tag> [message]"
  echo "Example: $0 v2.0.0 'Initial release'"
  exit 1
fi

# Validate tag format (vX.Y.Z)
if ! echo "$TAG" | grep -qE '^v[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Error: Tag must follow semantic versioning (e.g., v2.0.0)"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HISTORY_FILE="$ROOT_DIR/HISTORY.md"

# Check git status
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  Warning: Uncommitted changes detected."
  echo "   Commit or stash changes before tagging."
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Update HISTORY.md
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

if [ ! -f "$HISTORY_FILE" ]; then
  cat > "$HISTORY_FILE" <<EOF
# HISTORY

Version history for TYT Platform v2.

## $TAG - $TIMESTAMP

$MESSAGE

EOF
  echo "✅ Created: HISTORY.md"
else
  # Insert new entry at the top (after title and description)
  TEMP_FILE=$(mktemp)
  awk -v tag="$TAG" -v ts="$TIMESTAMP" -v msg="$MESSAGE" '
    NR==1 { print; next }
    NR==2 { print; print ""; next }
    NR==3 { 
      print "## " tag " - " ts; 
      print ""; 
      print msg; 
      print ""; 
      print $0; 
      next 
    }
    { print }
  ' "$HISTORY_FILE" > "$TEMP_FILE"
  
  mv "$TEMP_FILE" "$HISTORY_FILE"
  echo "✅ Updated: HISTORY.md"
fi

# Create git tag
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "⚠️  Tag $TAG already exists."
  read -p "Overwrite? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git tag -d "$TAG"
    git tag -a "$TAG" -m "$MESSAGE"
    echo "✅ Tag overwritten: $TAG"
  else
    echo "Skipped tagging."
    exit 0
  fi
else
  git tag -a "$TAG" -m "$MESSAGE"
  echo "✅ Git tag created: $TAG"
fi

echo ""
echo "🎉 Version $TAG created!"
echo "   Message: $MESSAGE"
echo "   HISTORY: $HISTORY_FILE"
echo ""
echo "Next steps:"
echo "  1. Review: git show $TAG"
echo "  2. Commit HISTORY.md: git add HISTORY.md && git commit -m 'docs: update HISTORY for $TAG'"
echo "  3. Push tag: git push origin $TAG"
