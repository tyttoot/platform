#!/bin/bash
# Script: add_doc_to_site.sh
# Purpose: Add a new doc to doc-site (only updates manifest - navigation auto-generates!)
# Usage: bash scripts/add_doc_to_site.sh <category> <filename> <title> [section]
# Example: bash scripts/add_doc_to_site.sh guides my-new-guide "My New Guide"
# Example: bash scripts/add_doc_to_site.sh specs api-reference "API Reference" "Specs"

set -e

CATEGORY="$1"
FILENAME="$2"
TITLE="$3"
SECTION="${4:-}"  # Optional: defaults based on category

if [ -z "$CATEGORY" ] || [ -z "$FILENAME" ] || [ -z "$TITLE" ]; then
  echo "❌ Usage: bash scripts/add_doc_to_site.sh <category> <filename> <title> [section]"
  echo ""
  echo "Arguments:"
  echo "  category  - guides, specs, or rules"
  echo "  filename  - filename without .json (e.g., my-new-guide)"
  echo "  title     - display title (e.g., 'My New Guide')"
  echo "  section   - (optional) nav section name (defaults: Guides/Specs/Rules)"
  echo ""
  echo "Example:"
  echo "  bash scripts/add_doc_to_site.sh guides my-guide 'My Guide'"
  echo "  bash scripts/add_doc_to_site.sh specs api-ref 'API Reference' 'Specs'"
  exit 1
fi

# Default section based on category
if [ -z "$SECTION" ]; then
  case "$CATEGORY" in
    guides) SECTION="Guides" ;;
    specs) SECTION="Specs" ;;
    rules) SECTION="Rules" ;;
    *) SECTION="Other" ;;
  esac
fi

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOC_SITE="$PROJECT_ROOT/projects/doc-site"
DATA_DIR="$DOC_SITE/data/docs/$CATEGORY"
JSON_FILE="$DATA_DIR/$FILENAME.json"
MANIFEST="$DOC_SITE/data/docs-manifest.json"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Add Doc to Doc-Site - Single File Update (v2.0)           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check if JSON file exists
echo "📋 Step 1: Checking JSON file..."
if [ ! -f "$JSON_FILE" ]; then
  echo "❌ JSON file not found: $JSON_FILE"
  echo ""
  echo "Please create the JSON file first with this structure:"
  echo '{'
  echo '  "id": "'$CATEGORY'.'$FILENAME'",'
  echo '  "version": "v2.0.0",'
  echo '  "category": "'$CATEGORY'",'
  echo '  "title": "'$TITLE'",'
  echo '  "tags": ["tag1", "tag2"],'
  echo '  "content": "Short description",'
  echo '  "links": [],'
  echo '  "items": []'
  echo '}'
  exit 1
fi
echo "✅ JSON file found: $JSON_FILE"

# Step 2: Validate JSON
echo ""
echo "📋 Step 2: Validating JSON..."
cd "$PROJECT_ROOT"
if make validate 2>&1 | grep -q "OK.*$FILENAME.json"; then
  echo "✅ JSON validation passed"
else
  echo "⚠️  JSON validation - please check manually"
fi

# Step 3: Update docs-manifest.json
echo ""
echo "📋 Step 3: Updating docs-manifest.json..."
FILE_PATH="$CATEGORY/$FILENAME.json"

# Check if already in manifest
if grep -q "\"$FILE_PATH\"" "$MANIFEST"; then
  echo "⚠️  Already in manifest, skipping..."
else
  # Add to manifest using node
  node -e "
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync('$MANIFEST', 'utf8'));
    
    // Find the section
    let section = manifest.navigation.find(s => s.section === '$SECTION');
    if (!section) {
      section = { section: '$SECTION', items: [] };
      manifest.navigation.push(section);
    }
    
    // Add the new item
    section.items.push({
      file: '$FILE_PATH',
      title: '$TITLE'
    });
    
    fs.writeFileSync('$MANIFEST', JSON.stringify(manifest, null, 2));
    console.log('✅ Added to manifest');
  " 2>/dev/null || {
    echo "⚠️  Auto-update failed. Please add manually to docs-manifest.json:"
    echo '    { "file": "'$FILE_PATH'", "title": "'$TITLE'" }'
  }
fi

# Step 4: Copy to build-output
echo ""
echo "📋 Step 4: Syncing to build-output..."
cp "$JSON_FILE" "$DOC_SITE/build-output/data/docs/$CATEGORY/"
cp "$MANIFEST" "$DOC_SITE/build-output/data/"
echo "✅ Synced to build-output"

# Summary
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ DONE!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Doc: $TITLE"
echo "File: $JSON_FILE"
echo "Section: $SECTION"
echo ""
echo "📝 Next steps:"
echo "   1. Refresh browser (navigation auto-generates from manifest)"
echo "   2. Test clicking the new doc in sidebar"
echo "   3. Commit changes"
echo ""
echo "════════════════════════════════════════════════════════════════"
