#!/bin/bash
# Update task index.json files to include all tasks
# Usage: bash scripts/update_task_index.sh [status]

TASKS_DIR="tasks/data"
STATUS=${1:-""}

STATUSES=("TODO" "IN_PROGRESS" "DONE" "REOPEN")

if [ -n "$STATUS" ]; then
    STATUSES=("$STATUS")
fi

for status in "${STATUSES[@]}"; do
    STATUS_DIR="$TASKS_DIR/$status"
    INDEX_FILE="$STATUS_DIR/index.json"
    
    if [ ! -d "$STATUS_DIR" ]; then
        continue
    fi
    
    echo "Updating index.json for $status..."
    
    # Find all task JSON files (excluding index.json)
    TASK_FILES=$(find "$STATUS_DIR" -maxdepth 1 -name "*.json" ! -name "index.json" 2>/dev/null | sort)
    
    if [ -z "$TASK_FILES" ]; then
        # Empty index
        echo '{"tasks": []}' > "$INDEX_FILE"
        echo "  → Empty index created"
        continue
    fi
    
    # Create temp file for tasks array
    TEMP_FILE=$(mktemp)
    echo '[' > "$TEMP_FILE"
    
    FIRST=true
    for file in $TASK_FILES; do
        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            echo ',' >> "$TEMP_FILE"
        fi
        cat "$file" >> "$TEMP_FILE"
    done
    
    echo ']' >> "$TEMP_FILE"
    
    # Create index.json with tasks array
    node -e "
        var tasks = JSON.parse(require('fs').readFileSync('$TEMP_FILE', 'utf8'));
        var result = { tasks: tasks };
        require('fs').writeFileSync('$INDEX_FILE', JSON.stringify(result, null, 2) + '\n');
        console.log('  → Updated with ' + tasks.length + ' task(s)');
    " 2>/dev/null || {
        echo '{"tasks": []}' > "$INDEX_FILE"
        echo "  → Error creating index, using empty"
    }
    
    rm -f "$TEMP_FILE"
done

echo "✅ Task index files updated"

