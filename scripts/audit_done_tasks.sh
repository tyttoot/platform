#!/bin/bash
# Audit all tasks in DONE status to check if they meet completion criteria
# Usage: bash scripts/audit_done_tasks.sh

TASKS_DIR="tasks/data/DONE"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"

echo "Auditing tasks in DONE status..."
echo "=================================="
echo ""

TASK_FILES=$(find "$TASKS_DIR" -maxdepth 1 -name "*.json" ! -name "index.json" 2>/dev/null | sort)

if [ -z "$TASK_FILES" ]; then
  echo "No tasks found in DONE status"
  exit 0
fi

INVALID_COUNT=0
VALID_COUNT=0

for task_file in $TASK_FILES; do
  task_id=$(basename "$task_file" .json)
  
  result=$(node -e "
    const t = JSON.parse(require('fs').readFileSync('$task_file', 'utf8'));
    const acTotal = t.acceptanceCriteria ? t.acceptanceCriteria.length : 0;
    const acCompleted = t.acceptanceCriteria ? t.acceptanceCriteria.filter(ac => ac.completed).length : 0;
    const stTotal = t.subtasks ? t.subtasks.length : 0;
    const stCompleted = t.subtasks ? t.subtasks.filter(st => st.completed).length : 0;
    const isValid = acTotal === 0 || (acCompleted === acTotal && (stTotal === 0 || stCompleted === stTotal));
    
    console.log(JSON.stringify({
      id: t.id,
      title: t.title,
      acTotal: acTotal,
      acCompleted: acCompleted,
      stTotal: stTotal,
      stCompleted: stCompleted,
      isValid: isValid
    }));
  ")
  
  id=$(echo "$result" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).id")
  title=$(echo "$result" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).title")
  acTotal=$(echo "$result" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).acTotal")
  acCompleted=$(echo "$result" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).acCompleted")
  stTotal=$(echo "$result" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).stTotal")
  stCompleted=$(echo "$result" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).stCompleted")
  isValid=$(echo "$result" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).isValid")
  
  if [ "$isValid" = "true" ]; then
    echo "✅ $id: $title"
    echo "   AC: $acCompleted/$acTotal  Subtasks: $stCompleted/$stTotal"
    VALID_COUNT=$((VALID_COUNT + 1))
  else
    echo "❌ $id: $title"
    if [ "$acTotal" != "0" ] && [ "$acCompleted" != "$acTotal" ]; then
      echo "   AC: $acCompleted/$acTotal (incomplete)"
    else
      echo "   AC: $acCompleted/$acTotal"
    fi
    if [ "$stTotal" != "0" ] && [ "$stCompleted" != "$stTotal" ]; then
      echo "   Subtasks: $stCompleted/$stTotal (incomplete)"
    else
      echo "   Subtasks: $stCompleted/$stTotal"
    fi
    INVALID_COUNT=$((INVALID_COUNT + 1))
  fi
  echo ""
done

echo "=================================="
echo "Summary:"
echo "  Valid: $VALID_COUNT"
echo "  Invalid: $INVALID_COUNT"
echo "  Total: $((VALID_COUNT + INVALID_COUNT))"

if [ "$INVALID_COUNT" -gt 0 ]; then
  echo ""
  echo "⚠️  Some tasks in DONE status do not meet completion criteria"
  echo "   Consider moving them back to IN_PROGRESS or completing remaining items"
  exit 1
fi

exit 0

