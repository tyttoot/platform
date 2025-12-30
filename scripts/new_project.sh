#!/bin/bash
# scripts/new_project.sh - Scaffold a new project from template

set -e

NAME="$1"

if [ -z "$NAME" ]; then
  echo "Usage: $0 <name>"
  echo "Example: $0 my-app"
  exit 1
fi

# Validate name (lowercase, hyphens only)
if ! echo "$NAME" | grep -qE '^[a-z0-9-]+$'; then
  echo "Error: Project name must be lowercase with hyphens only (e.g., my-app)"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_DIR="$ROOT_DIR/templates/project-template"
TARGET_DIR="$ROOT_DIR/projects/$NAME"

# Check if project already exists
if [ -d "$TARGET_DIR" ]; then
  echo "Error: Project already exists at $TARGET_DIR"
  exit 1
fi

echo "Creating project: $NAME"

# Create project structure
mkdir -p "$TARGET_DIR/www"
mkdir -p "$TARGET_DIR/data"
mkdir -p "$TARGET_DIR/deploy"
mkdir -p "$TARGET_DIR/document"

# Copy and customize templates
for template in "$TEMPLATE_DIR"/www/*.template; do
  if [ -f "$template" ]; then
    filename=$(basename "$template" .template)
    sed "s/{{NAME}}/$NAME/g" "$template" > "$TARGET_DIR/www/$filename"
    echo "✅ Created: projects/$NAME/www/$filename"
  fi
done

for template in "$TEMPLATE_DIR"/data/*.template; do
  if [ -f "$template" ]; then
    filename=$(basename "$template" .template)
    sed "s/{{NAME}}/$NAME/g" "$template" > "$TARGET_DIR/data/$filename"
    echo "✅ Created: projects/$NAME/data/$filename"
  fi
done

for template in "$TEMPLATE_DIR"/document/*.template "$TEMPLATE_DIR"/deploy/*.template; do
  if [ -f "$template" ]; then
    dir=$(basename "$(dirname "$template")")
    filename=$(basename "$template" .template)
    sed "s/{{NAME}}/$NAME/g" "$template" > "$TARGET_DIR/$dir/$filename"
    echo "✅ Created: projects/$NAME/$dir/$filename"
  fi
done

# Copy README
if [ -f "$TEMPLATE_DIR/README.md" ]; then
  sed "s/{{NAME}}/$NAME/g" "$TEMPLATE_DIR/README.md" > "$TARGET_DIR/README.md"
  echo "✅ Created: projects/$NAME/README.md"
fi

# Copy .gitkeep files
if [ -f "$TEMPLATE_DIR/deploy/.gitkeep" ]; then
  cp "$TEMPLATE_DIR/deploy/.gitkeep" "$TARGET_DIR/deploy/"
fi

echo ""
echo "🎉 Project created successfully!"
echo "   Path: projects/$NAME/"
echo ""
echo "Next steps:"
echo "  1. cd projects/$NAME/www/"
echo "  2. Edit define.js, index.html, index.css"
echo "  3. Run: make serve (from root)"
echo "  4. Open: http://localhost:8080/projects/$NAME/www/"
