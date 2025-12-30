#!/bin/bash
# scripts/task_manager.sh - Task management CLI for TYT Platform v2

set -e

ACTION="$1"
shift

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TASKS_DIR="$ROOT_DIR/tasks/data"

function show_usage() {
  cat <<EOF
Usage: task_manager.sh <action> [options]

Actions:
  new <id> <title> [priority] [assignee]  - Create new task
  list [status]                            - List tasks (all or by status)
  show <id>                                - Show task details
  move <id> <to_status>                    - Move task to new status
  done <id> [--force]                      - Mark task as done (requires all AC/subtasks completed, use --force to override)
  reopen <id>                              - Reopen completed task
  validate [task_file]                     - Validate task JSON

Examples:
  task_manager.sh new 002-add-feature "Add search feature" High Norman
  task_manager.sh list TODO
  task_manager.sh show 001-task-management
  task_manager.sh move 001-task-management IN_PROGRESS
  task_manager.sh done 001-task-management
EOF
}

function get_timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

function find_task() {
  local id="$1"
  for status in TODO IN_PROGRESS DONE REOPEN; do
    local file="$TASKS_DIR/$status/$id.json"
    if [ -f "$file" ]; then
      echo "$file"
      return 0
    fi
  done
  return 1
}

function task_new() {
  local id="$1"
  local title="$2"
  local priority="${3:-Medium}"
  local assignee="${4:-Unassigned}"
  
  if [ -z "$id" ] || [ -z "$title" ]; then
    echo "Error: ID and title required"
    show_usage
    exit 1
  fi
  
  # Validate ID format
  if ! echo "$id" | grep -qE '^[0-9]{3}-[a-z0-9-]+$'; then
    echo "Error: ID must match pattern: 001-task-name"
    exit 1
  fi
  
  # Check if task exists
  if find_task "$id" >/dev/null 2>&1; then
    echo "Error: Task $id already exists"
    exit 1
  fi
  
  local file="$TASKS_DIR/TODO/$id.json"
  local timestamp=$(get_timestamp)
  
  mkdir -p "$TASKS_DIR/TODO"
  
  cat > "$file" <<EOF
{
  "id": "$id",
  "title": "$title",
  "status": "TODO",
  "priority": "$priority",
  "created": "$timestamp",
  "updated": "$timestamp",
  "assignee": "$assignee",
  "description": "",
  "acceptanceCriteria": [],
  "subtasks": [],
  "tags": [],
  "relatedFiles": [],
  "notes": "",
  "history": [
    {"timestamp": "$timestamp", "action": "created", "status": "TODO"}
  ]
}
EOF
  
  echo "✅ Created task: $id"
  echo "   File: $file"
  echo "   Title: $title"
  echo "   Priority: $priority"
}

function task_list() {
  local filter_status="$1"
  
  if [ -n "$filter_status" ]; then
    local dir="$TASKS_DIR/$filter_status"
    if [ ! -d "$dir" ]; then
      echo "No tasks in $filter_status"
      return
    fi
    echo "=== $filter_status ==="
    for file in "$dir"/*.json; do
      [ -f "$file" ] || continue
      local id=$(basename "$file" .json)
      # Skip index.json files
      [ "$id" = "index" ] && continue
      local title=$(node -p "JSON.parse(require('fs').readFileSync('$file', 'utf8')).title" 2>/dev/null || echo "N/A")
      local priority=$(node -p "JSON.parse(require('fs').readFileSync('$file', 'utf8')).priority" 2>/dev/null || echo "N/A")
      printf "  [%s] %s (Priority: %s)\n" "$id" "$title" "$priority"
    done
  else
    for status in TODO IN_PROGRESS DONE REOPEN; do
      task_list "$status"
    done
  fi
}

function task_show() {
  local id="$1"
  if [ -z "$id" ]; then
    echo "Error: Task ID required"
    exit 1
  fi
  
  local file=$(find_task "$id")
  if [ -z "$file" ]; then
    echo "Error: Task $id not found"
    exit 1
  fi
  
  cat "$file" | node -p "
    const t = JSON.parse(require('fs').readFileSync('$file', 'utf8'));
    \`Task: \${t.id}
Title: \${t.title}
Status: \${t.status}
Priority: \${t.priority}
Created: \${t.created}
Assignee: \${t.assignee}
Description: \${t.description || 'N/A'}
Acceptance Criteria: \${t.acceptanceCriteria.length} items
Subtasks: \${t.subtasks.filter(s => s.completed).length}/\${t.subtasks.length} completed
Tags: \${t.tags.join(', ') || 'None'}
Notes: \${t.notes || 'None'}\`
  "
}

function task_move() {
  local id="$1"
  local to_status="$2"
  local force="$3"
  
  if [ -z "$id" ] || [ -z "$to_status" ]; then
    echo "Error: Task ID and target status required"
    exit 1
  fi
  
  if ! echo "$to_status" | grep -qE '^(TODO|IN_PROGRESS|DONE|REOPEN)$'; then
    echo "Error: Invalid status. Must be: TODO, IN_PROGRESS, DONE, or REOPEN"
    exit 1
  fi
  
  local old_file=$(find_task "$id")
  if [ -z "$old_file" ]; then
    echo "Error: Task $id not found"
    exit 1
  fi
  
  # Validate completion before moving to DONE
  if [ "$to_status" = "DONE" ] && [ "$force" != "force" ]; then
    local validation=$(node -p "
      const t = JSON.parse(require('fs').readFileSync('$old_file', 'utf8'));
      const acTotal = t.acceptanceCriteria ? t.acceptanceCriteria.length : 0;
      const acCompleted = t.acceptanceCriteria ? t.acceptanceCriteria.filter(ac => ac.completed).length : 0;
      const stTotal = t.subtasks ? t.subtasks.length : 0;
      const stCompleted = t.subtasks ? t.subtasks.filter(st => st.completed).length : 0;
      JSON.stringify({
        acTotal: acTotal,
        acCompleted: acCompleted,
        stTotal: stTotal,
        stCompleted: stCompleted,
        isValid: acTotal === 0 || (acCompleted === acTotal && (stTotal === 0 || stCompleted === stTotal))
      })
    ")
    
    local isValid=$(echo "$validation" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).isValid")
    local acTotal=$(echo "$validation" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).acTotal")
    local acCompleted=$(echo "$validation" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).acCompleted")
    local stTotal=$(echo "$validation" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).stTotal")
    local stCompleted=$(echo "$validation" | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).stCompleted")
    
    if [ "$isValid" != "true" ]; then
      echo "❌ Cannot move task to DONE:"
      if [ "$acTotal" != "0" ] && [ "$acCompleted" != "$acTotal" ]; then
        echo "   Acceptance Criteria: $acCompleted/$acTotal completed"
      fi
      if [ "$stTotal" != "0" ] && [ "$stCompleted" != "$stTotal" ]; then
        echo "   Subtasks: $stCompleted/$stTotal completed"
      fi
      echo ""
      echo "Please complete all acceptance criteria and subtasks first, or use --force to override"
      exit 1
    fi
  fi
  
  local new_file="$TASKS_DIR/$to_status/$id.json"
  mkdir -p "$TASKS_DIR/$to_status"
  
  # Update status and history
  local timestamp=$(get_timestamp)
  node -p "
    const t = JSON.parse(require('fs').readFileSync('$old_file', 'utf8'));
    t.status = '$to_status';
    t.updated = '$timestamp';
    t.history.push({timestamp: '$timestamp', action: 'moved', status: '$to_status'});
    JSON.stringify(t, null, 2)
  " > "$new_file"
  
  rm "$old_file"
  
  echo "✅ Moved task: $id → $to_status"
}

function task_done() {
  local id="$1"
  local force="$2"
  task_move "$id" "DONE" "$force"
}

function task_reopen() {
  task_move "$1" "REOPEN"
}

function task_validate() {
  local file="$1"
  if [ -z "$file" ]; then
    echo "Validating all tasks..."
    for status in TODO IN_PROGRESS DONE REOPEN; do
      for task_file in "$TASKS_DIR/$status"/*.json; do
        [ -f "$task_file" ] || continue
        if node -e "JSON.parse(require('fs').readFileSync('$task_file', 'utf8'))" 2>/dev/null; then
          echo "OK   $task_file"
        else
          echo "FAIL $task_file"
        fi
      done
    done
  else
    if node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
      echo "✅ Valid: $file"
    else
      echo "❌ Invalid: $file"
      exit 1
    fi
  fi
}

# Main
case "$ACTION" in
  new)
    task_new "$@"
    ;;
  list)
    task_list "$@"
    ;;
  show)
    task_show "$@"
    ;;
  move)
    task_move "$@"
    ;;
  done)
    task_done "$@"
    ;;
  reopen)
    task_reopen "$@"
    ;;
  validate)
    task_validate "$@"
    ;;
  *)
    show_usage
    exit 1
    ;;
esac
