# Tasks - Task Management System

JSON-driven task management for TYT Platform v2.

## Overview

Modern Kanban-style task tracking with JSON storage, CLI automation, and optional UI integration.

## Structure

```
tasks/
├── schema.json          # Task data schema
├── data/                # Task data storage
│   ├── TODO/           # Tasks to do
│   ├── IN_PROGRESS/    # Tasks in progress
│   ├── DONE/           # Completed tasks
│   └── REOPEN/         # Reopened tasks
└── README.md           # This file
```

## Workflow

```
TODO → IN_PROGRESS → DONE
                       ↓
                    REOPEN → IN_PROGRESS → DONE
```

## Quick Start

### Create Task
```bash
make task-new id=001-test-feature title="Test new feature" priority=High
```

### List Tasks
```bash
make task-list status=TODO
make task-list              # All tasks
```

### Move Task
```bash
make task-move id=001-test-feature to=IN_PROGRESS
```

### Complete Task
```bash
make task-done id=001-test-feature
```

### View Task
```bash
make task-show id=001-test-feature
```

## Task Schema

Each task is a JSON file with:
- `id`: Unique identifier (e.g., 001-test-feature)
- `title`: Task name
- `status`: TODO | IN_PROGRESS | DONE | REOPEN
- `priority`: Low | Medium | High | Critical
- `created`: Timestamp
- `description`: Detailed description
- `acceptanceCriteria`: Array of criteria (id, text, completed)
- `subtasks`: Array of subtasks (id, text, completed)
- `tags`: Array of tags
- `relatedFiles`: Related file paths
- `notes`: Additional notes
- `history`: Status change history

## Example Task

```json
{
  "id": "001-test-feature",
  "title": "Test new feature",
  "status": "TODO",
  "priority": "High",
  "created": "2024-12-21T10:00:00Z",
  "description": "Test the new search feature in doc-site",
  "acceptanceCriteria": [
    {"id": "AC-1", "text": "Search works with keywords", "completed": false},
    {"id": "AC-2", "text": "Results filter in real-time", "completed": false}
  ],
  "subtasks": [
    {"id": "ST-1", "text": "Add search input", "completed": true},
    {"id": "ST-2", "text": "Wire search logic", "completed": false}
  ],
  "tags": ["doc-site", "search", "ui"],
  "relatedFiles": ["projects/doc-site/www/index.html", "entity/index.js"],
  "notes": "Consider edge cases with special characters",
  "history": [
    {"timestamp": "2024-12-21T10:00:00Z", "action": "created", "status": "TODO"}
  ]
}
```

## Automation Commands

All commands available via Makefile:

- `make task-new` - Create new task
- `make task-list` - List tasks (filter by status)
- `make task-show` - Show task details
- `make task-move` - Move task to different status
- `make task-done` - Mark task as done
- `make task-reopen` - Reopen completed task
- `make task-archive` - Archive old completed tasks

## Integration

Tasks can be:
- Managed via CLI (Makefile commands)
- Viewed in doc-site (optional UI integration)
- Tracked in history logs (auto-logged)
- Validated against schema

## Best Practices

1. Use descriptive IDs (001-feature-name, not just 001)
2. Add acceptance criteria for clarity
3. Break down large tasks into subtasks
4. Tag tasks for easy filtering
5. Link related files for context
6. Update history when moving tasks
7. Archive completed tasks periodically
