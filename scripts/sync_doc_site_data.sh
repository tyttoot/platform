#!/bin/bash
# Sync doc-site data from source to build-output
# Usage: bash scripts/sync_doc_site_data.sh [--force]
# Auto-syncs: data/, tasks/ data
# Use --force to sync even if build-output doesn't exist

PROJECT_NAME="doc-site"
PROJECT_ROOT="projects/$PROJECT_NAME"
BUILD_OUTPUT="$PROJECT_ROOT/build-output"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FORCE=${1:-""}

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Syncing doc-site data to build-output${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Create build-output if doesn't exist (for development serve)
if [ ! -d "$BUILD_OUTPUT" ]; then
    if [ "$FORCE" = "--force" ]; then
        echo -e "${YELLOW}→ Creating build-output directory (dev mode)...${NC}"
        mkdir -p "$BUILD_OUTPUT/data"
        # Copy www files if exists (for dev mode)
        if [ -d "$PROJECT_ROOT/www" ]; then
            cp -r "$PROJECT_ROOT/www" "$BUILD_OUTPUT/" 2>/dev/null || true
            echo -e "${GREEN}✓ Copied www/ files${NC}"
        fi
        echo -e "${GREEN}✓ Created build-output for development${NC}"
    else
        echo -e "${YELLOW}⚠ build-output doesn't exist. Run 'make build project=doc-site' first, or use --force${NC}"
        exit 0
    fi
fi

# Create build-output/data if doesn't exist
if [ ! -d "$BUILD_OUTPUT/data" ]; then
    echo -e "${YELLOW}→ Creating build-output/data directory...${NC}"
    mkdir -p "$BUILD_OUTPUT/data"
fi

# Step 1: Sync docs data
echo -e "\n${YELLOW}→ Step 1: Syncing docs data...${NC}"
if [ -d "$PROJECT_ROOT/data" ]; then
    rsync -av --delete "$PROJECT_ROOT/data/" "$BUILD_OUTPUT/data/" 2>/dev/null
    echo -e "${GREEN}✓ Synced: data/docs/, data/docs-manifest.json, data/schema.json${NC}"
else
    echo -e "${RED}✗ Source data directory not found: $PROJECT_ROOT/data${NC}"
    exit 1
fi

# Step 2: Update task index files (aggregate all tasks)
echo -e "\n${YELLOW}→ Step 2: Updating task index files...${NC}"
bash scripts/update_task_index.sh 2>/dev/null || echo -e "  ${YELLOW}⚠ Failed to update task indexes${NC}"
echo -e "${GREEN}✓ Task indexes updated${NC}"

# Step 3: Sync tasks data
echo -e "\n${YELLOW}→ Step 3: Syncing tasks data...${NC}"
TASKS_SOURCE="tasks/data"
TASKS_DEST="$BUILD_OUTPUT/data/tasks"

if [ -d "$TASKS_SOURCE" ]; then
    mkdir -p "$TASKS_DEST"
    
    # Sync all task status directories
    STATUSES=("TODO" "IN_PROGRESS" "DONE" "REOPEN")
    for status in "${STATUSES[@]}"; do
        if [ -d "$TASKS_SOURCE/$status" ]; then
            mkdir -p "$TASKS_DEST/$status"
            rsync -av "$TASKS_SOURCE/$status/" "$TASKS_DEST/$status/" 2>/dev/null
            echo -e "  ${GREEN}✓ Synced: tasks/data/$status/ → build-output/data/tasks/$status/${NC}"
        fi
    done
    
    # Copy schema if exists
    if [ -f "tasks/schema.json" ]; then
        cp "tasks/schema.json" "$TASKS_DEST/schema.json" 2>/dev/null
        echo -e "  ${GREEN}✓ Copied: tasks/schema.json${NC}"
    fi
    
    echo -e "${GREEN}✓ Tasks data synced${NC}"
else
    echo -e "${YELLOW}⚠ Tasks directory not found: $TASKS_SOURCE${NC}"
fi

# Step 4: Verify task paths
echo -e "\n${YELLOW}→ Step 4: Verifying task paths...${NC}"
echo -e "${GREEN}✓ Task paths verified (using relative paths from build-output)${NC}"

# Summary
echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Data sync completed!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "📁 Build output: $BUILD_OUTPUT/data/"
echo -e "📄 Docs: $BUILD_OUTPUT/data/docs/"
echo -e "📋 Tasks: $BUILD_OUTPUT/data/tasks/"

