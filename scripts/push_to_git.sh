#!/bin/bash
# Push project to git with version tagging
# Usage: bash scripts/push_to_git.sh <project> <version> [branch] [message]
# Example: bash scripts/push_to_git.sh doc-site v2.0.0 staging "Initial deployment"

PROJECT=$1
VERSION=$2
BRANCH=${3:-"main"}
MESSAGE=${4:-"Release $VERSION of $PROJECT"}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Validation
if [ -z "$PROJECT" ] || [ -z "$VERSION" ]; then
    echo -e "${RED}Error: Missing required parameters${NC}"
    echo "Usage: bash scripts/push_to_git.sh <project> <version> [branch] [message]"
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Pushing release to git${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Check git status
echo -e "\n${YELLOW}→ Checking git status...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠ Uncommitted changes detected. Committing...${NC}"
    git add -A
    git commit -m "[RELEASE] $VERSION - $PROJECT - $MESSAGE"
fi

# Create git tag
echo -e "\n${YELLOW}→ Creating git tag...${NC}"
TAG_MSG="Release $VERSION for $PROJECT

Project: $PROJECT
Version: $VERSION
Branch: $BRANCH
Date: $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)

$MESSAGE

Build output at: projects/$PROJECT/build-output/"

if git tag -a "$VERSION" -m "$TAG_MSG"; then
    echo -e "${GREEN}✓ Git tag created: $VERSION${NC}"
else
    echo -e "${RED}✗ Failed to create git tag. It may already exist.${NC}"
    exit 1
fi

# Push to branch
echo -e "\n${YELLOW}→ Pushing code to branch: $BRANCH${NC}"
if git push origin HEAD:$BRANCH; then
    echo -e "${GREEN}✓ Code pushed to $BRANCH${NC}"
else
    echo -e "${RED}✗ Failed to push code${NC}"
    exit 1
fi

# Push tags
echo -e "\n${YELLOW}→ Pushing git tags...${NC}"
if git push origin $VERSION; then
    echo -e "${GREEN}✓ Tag pushed: $VERSION${NC}"
else
    echo -e "${RED}✗ Failed to push tag${NC}"
    exit 1
fi

# Log to history
echo -e "\n${YELLOW}→ Logging to history...${NC}"
COMMIT=$(git rev-parse --short HEAD)
make history-add action="release" msg="v$VERSION released: $PROJECT on branch $BRANCH (commit: $COMMIT)" || true

echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Release pushed successfully!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "Project:     ${BLUE}$PROJECT${NC}"
echo -e "Version:     ${BLUE}$VERSION${NC}"
echo -e "Branch:      ${BLUE}$BRANCH${NC}"
echo -e "Commit:      ${BLUE}$COMMIT${NC}"
echo -e "Timestamp:   ${BLUE}$(date -u +%Y-%m-%dT%H:%M:%SZ)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. On hosting: git pull origin $BRANCH"
echo -e "  2. Run any migrations if needed"
echo -e "  3. Verify deployment"
echo -e "  4. Backup database before going live"
