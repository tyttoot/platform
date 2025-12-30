#!/bin/bash
# Build project into self-contained output folder
# Usage: bash scripts/build_project.sh <project-name> [version]
# Example: bash scripts/build_project.sh doc-site v2.0.0

PROJECT_NAME=${1:-"doc-site"}
VERSION=${2:-"dev"}
PROJECT_ROOT="projects/$PROJECT_NAME"
BUILD_OUTPUT="$PROJECT_ROOT/build-output"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Building project: $PROJECT_NAME (v$VERSION)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Check if project exists
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}Error: Project '$PROJECT_NAME' not found at $PROJECT_ROOT${NC}"
    exit 1
fi

# Create clean output directory
echo -e "\n${YELLOW}→ Creating build output directory...${NC}"
rm -rf "$BUILD_OUTPUT"
mkdir -p "$BUILD_OUTPUT"
echo -e "${GREEN}✓ Created: $BUILD_OUTPUT${NC}"

# Copy project files (exclude unnecessary files)
echo -e "\n${YELLOW}→ Copying project files...${NC}"
cp -r "$PROJECT_ROOT/www" "$BUILD_OUTPUT/" 2>/dev/null || true
cp -r "$PROJECT_ROOT/data" "$BUILD_OUTPUT/" 2>/dev/null || true
cp -r "$PROJECT_ROOT/document" "$BUILD_OUTPUT/" 2>/dev/null || true

# Copy locale data if present (per-locale docs under data/locales)
if [ -d "$PROJECT_ROOT/data/locales" ]; then
  echo -e "\n${YELLOW}→ Copying locale data...${NC}"
  mkdir -p "$BUILD_OUTPUT/data/locales"
  cp -r "$PROJECT_ROOT/data/locales/" "$BUILD_OUTPUT/data/" 2>/dev/null || true
  echo -e "${GREEN}✓ Copied locales to build-output/data/locales/${NC}"
fi

# Sync tasks data if project is doc-site
if [ "$PROJECT_NAME" = "doc-site" ]; then
    echo -e "\n${YELLOW}→ Syncing tasks data...${NC}"
    TASKS_SOURCE="tasks/data"
    TASKS_DEST="$BUILD_OUTPUT/data/tasks"
    
    if [ -d "$TASKS_SOURCE" ]; then
        mkdir -p "$TASKS_DEST"
        STATUSES=("TODO" "IN_PROGRESS" "DONE" "REOPEN")
        for status in "${STATUSES[@]}"; do
            if [ -d "$TASKS_SOURCE/$status" ]; then
                mkdir -p "$TASKS_DEST/$status"
                cp -r "$TASKS_SOURCE/$status/"* "$TASKS_DEST/$status/" 2>/dev/null || true
            fi
        done
        [ -f "tasks/schema.json" ] && cp "tasks/schema.json" "$TASKS_DEST/" 2>/dev/null || true
        echo -e "${GREEN}✓ Synced tasks data to build-output/data/tasks/${NC}"
    fi
fi

# Copy important config files if they exist
[ -f "$PROJECT_ROOT/define.js" ] && cp "$PROJECT_ROOT/define.js" "$BUILD_OUTPUT/"
[ -f "$PROJECT_ROOT/package.json" ] && cp "$PROJECT_ROOT/package.json" "$BUILD_OUTPUT/"
[ -f "$PROJECT_ROOT/README.md" ] && cp "$PROJECT_ROOT/README.md" "$BUILD_OUTPUT/"

echo -e "${GREEN}✓ Copied: www/, data/, document/, and config files${NC}"

# Get current git info
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Count changes since last tag
FILES_CHANGED=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | wc -l)
FILES_ADDED=$(git diff --name-only --diff-filter=A HEAD~1 HEAD 2>/dev/null | wc -l)
FILES_MODIFIED=$(git diff --name-only --diff-filter=M HEAD~1 HEAD 2>/dev/null | wc -l)
FILES_DELETED=$(git diff --name-only --diff-filter=D HEAD~1 HEAD 2>/dev/null | wc -l)

# Generate release manifest
echo -e "\n${YELLOW}→ Generating release manifest...${NC}"
MANIFEST_FILE="$BUILD_OUTPUT/.release-manifest.json"
# Build locale list for manifest
LOCALES_JSON="[]"
if [ -d "$PROJECT_ROOT/data/locales" ]; then
  LOCALES_JSON="["
  first=true
  for d in "$PROJECT_ROOT/data/locales"/*; do
    if [ -d "$d" ]; then
      id=$(basename "$d")
      if [ "$first" = true ]; then
        LOCALES_JSON="$LOCALES_JSON\n    { \"id\": \"$id\", \"path\": \"data/locales/$id\" }"
        first=false
      else
        LOCALES_JSON="$LOCALES_JSON,\n    { \"id\": \"$id\", \"path\": \"data/locales/$id\" }"
      fi
    fi
  done
  LOCALES_JSON="$LOCALES_JSON\n  ]"
fi

cat > "$MANIFEST_FILE" << EOF
{
  "version": "$VERSION",
  "timestamp": "$TIMESTAMP",
  "project": "$PROJECT_NAME",
  "branch": "$CURRENT_BRANCH",
  "buildOutputPath": "$BUILD_OUTPUT/",
  "git": {
    "commit": "$COMMIT_HASH",
    "tag": "v$VERSION",
    "author": "$(git config user.name 2>/dev/null || echo 'Unknown')"
  },
  "changes": {
    "filesAdded": $FILES_ADDED,
    "filesModified": $FILES_MODIFIED,
    "filesDeleted": $FILES_DELETED,
    "totalChanged": $FILES_CHANGED,
    "description": "Build output generated for release"
  },
  "locales": $LOCALES_JSON,
  "database": {
    "backupLocation": "backups/v$VERSION-backup.tar.gz",
    "backupTimestamp": "$TIMESTAMP",
    "note": "Database snapshot backup location reference (created on hosting)"
  },
  "rollbackInfo": {
    "rollbackCommand": "git checkout v$(echo $VERSION | sed 's/\([0-9]*\)\\.[0-9]*\\.[0-9]*$/\\1.0.0/')"
  },
  "releaseNotes": "Release $VERSION of $PROJECT_NAME"
}
EOF

echo -e "${GREEN}✓ Generated: .release-manifest.json${NC}"

# Display summary
echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Build Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "Project:     ${BLUE}$PROJECT_NAME${NC}"
echo -e "Version:     ${BLUE}v$VERSION${NC}"
echo -e "Output:      ${BLUE}$BUILD_OUTPUT/${NC}"
echo -e "Commit:      ${BLUE}$COMMIT_HASH${NC}"
echo -e "Timestamp:   ${BLUE}$TIMESTAMP${NC}"
echo -e "Files:       ${BLUE}+$FILES_ADDED ~$FILES_MODIFIED -$FILES_DELETED${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Verify build output: ls -la $BUILD_OUTPUT"
echo -e "  2. Run tests: make test"
echo -e "  3. Push release: make push project=$PROJECT_NAME version=$VERSION"
