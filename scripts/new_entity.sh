#!/bin/bash
# scripts/new_entity.sh - Scaffold a new entity module from template

set -e

NAME="$1"
CATEGORY="${2:-common}"
DESCRIPTION="${3:-New entity module}"

if [ -z "$NAME" ]; then
  echo "Usage: $0 <name> [category=common] [description]"
  echo "Example: $0 storage common 'Local storage helper'"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_DIR="$ROOT_DIR/templates/entity-template"
TARGET_DIR="$ROOT_DIR/entity/$CATEGORY"
MODULE_FILE="$TARGET_DIR/$NAME.js"

# Check if module already exists
if [ -f "$MODULE_FILE" ]; then
  echo "Error: Module already exists at $MODULE_FILE"
  exit 1
fi

# Create category directory if needed
mkdir -p "$TARGET_DIR"

# Copy and customize module template
if [ -f "$TEMPLATE_DIR/module.js.template" ]; then
  sed -e "s/{{NAME}}/$NAME/g" \
      -e "s/{{CATEGORY}}/$CATEGORY/g" \
      -e "s/{{DESCRIPTION}}/$DESCRIPTION/g" \
      "$TEMPLATE_DIR/module.js.template" > "$MODULE_FILE"
  echo "✅ Created: $MODULE_FILE"
else
  # Fallback: create simple module
  cat > "$MODULE_FILE" <<EOF
// entity/$CATEGORY/$NAME.js
// $DESCRIPTION

if (typeof tyt === 'undefined') { window.tyt = {}; }

(function(){
  tyt.lib = tyt.lib || {};
  tyt.lib.$CATEGORY = tyt.lib.$CATEGORY || {};

  function init() {
    return true;
  }

  tyt.lib.$CATEGORY.$NAME = {
    init: init
  };
})();
EOF
  echo "✅ Created: $MODULE_FILE (fallback template)"
fi

# Create or update README in category
README_FILE="$TARGET_DIR/README.md"
if [ ! -f "$README_FILE" ]; then
  cat > "$README_FILE" <<EOF
# entity/$CATEGORY/

$CATEGORY modules for TYT Platform v2.

## Modules

- [$NAME.js]($NAME.js) - $DESCRIPTION

EOF
  echo "✅ Created: $README_FILE"
else
  # Append to existing README if not already listed
  if ! grep -q "$NAME.js" "$README_FILE"; then
    echo "- [$NAME.js]($NAME.js) - $DESCRIPTION" >> "$README_FILE"
    echo "✅ Updated: $README_FILE"
  fi
fi

echo ""
echo "🎉 Entity module created successfully!"
echo "   File: entity/$CATEGORY/$NAME.js"
echo ""
echo "Next steps:"
echo "  1. Edit entity/$CATEGORY/$NAME.js to implement logic"
echo "  2. Require in entity/index.js: tyt.require('lib/$CATEGORY/$NAME')"
echo "  3. Test in browser/node"
