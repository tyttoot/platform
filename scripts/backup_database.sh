#!/bin/bash
# Backup database files for a release version
# Usage: bash scripts/backup_database.sh <version> <path1> [path2] [path3] ...
# Example: bash scripts/backup_database.sh v2.0.0 database/local data/

VERSION=$1
shift
BACKUP_PATHS="$@"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Validation
if [ -z "$VERSION" ] || [ -z "$BACKUP_PATHS" ]; then
    echo -e "${RED}Error: Missing required parameters${NC}"
    echo "Usage: bash scripts/backup_database.sh <version> <path1> [path2] ..."
    exit 1
fi

BACKUP_DIR="backups/$VERSION-backup"
BACKUP_FILE="backups/$VERSION-backup.tar.gz"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Backing up database for: $VERSION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

# Create backup directory
echo -e "\n${YELLOW}→ Creating backup directory...${NC}"
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✓ Created: $BACKUP_DIR${NC}"

# Copy files to backup directory
echo -e "\n${YELLOW}→ Copying database files...${NC}"
TOTAL_SIZE=0
FILES_BACKED_UP=0

for PATH in $BACKUP_PATHS; do
    if [ -e "$PATH" ]; then
        echo -e "  Copying: $PATH"
        cp -r "$PATH" "$BACKUP_DIR/" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            FILES_BACKED_UP=$((FILES_BACKED_UP + 1))
            SIZE=$(du -sh "$PATH" | cut -f1)
            echo -e "  ${GREEN}✓ Backed up: $PATH ($SIZE)${NC}"
        else
            echo -e "  ${YELLOW}⚠ Warning: Could not backup $PATH${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠ Skipping (not found): $PATH${NC}"
    fi
done

# Create backup metadata
echo -e "\n${YELLOW}→ Creating backup metadata...${NC}"
BACKUP_METADATA="$BACKUP_DIR/backup-metadata.json"

cat > "$BACKUP_METADATA" << EOF
{
  "version": "$VERSION",
  "timestamp": "$TIMESTAMP",
  "paths": [$( echo "$BACKUP_PATHS" | sed 's/ /","/g' | sed 's/^/"/g' | sed 's/$/"/g')],
  "filesBackedUp": $FILES_BACKED_UP,
  "note": "Database backup for recovery in case of rollback"
}
EOF

echo -e "${GREEN}✓ Created: backup-metadata.json${NC}"

# Create tar.gz archive
echo -e "\n${YELLOW}→ Creating compressed backup archive...${NC}"
if tar -czf "$BACKUP_FILE" -C backups "$VERSION-backup" 2>/dev/null; then
    echo -e "${GREEN}✓ Created: $BACKUP_FILE${NC}"
    
    # Get backup size
    BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
    echo -e "${BLUE}  Size: $BACKUP_SIZE${NC}"
    
    # Calculate checksum
    CHECKSUM=$(shasum -a 256 "$BACKUP_FILE" | awk '{print $1}')
    echo -e "${BLUE}  Checksum: $CHECKSUM${NC}"
else
    echo -e "${RED}✗ Failed to create backup archive${NC}"
    exit 1
fi

# Cleanup backup directory (keep only .tar.gz)
echo -e "\n${YELLOW}→ Cleaning up...${NC}"
rm -rf "$BACKUP_DIR"
echo -e "${GREEN}✓ Removed temporary backup directory${NC}"

# Summary
echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Backup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "Version:     ${BLUE}$VERSION${NC}"
echo -e "Backup:      ${BLUE}$BACKUP_FILE${NC}"
echo -e "Size:        ${BLUE}$BACKUP_SIZE${NC}"
echo -e "Files:       ${BLUE}$FILES_BACKED_UP${NC}"
echo -e "Timestamp:   ${BLUE}$TIMESTAMP${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}To restore this backup:${NC}"
echo -e "  tar -xzf $BACKUP_FILE -C /path/to/restore/"
