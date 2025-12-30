# Task Management Guide

**Version:** v2.1.0
**Category:** guides
**Tags:** `tasks`, `kanban`, `automation`, `workflow`

Complete guide to managing tasks in TYT Platform v2 using JSON-driven Kanban workflow with CLI and UI integration.

---

## 1. Task Management Overview

**Why:** Organize and track platform development work

**What:** JSON-based Kanban system (TODO → IN_PROGRESS → DONE → REOPEN)

**How:**

```
Use CLI commands or web UI to create, view, and manage tasks
```

## 2. Create New Task

**Why:** Track new work items systematically

**What:** Generate task JSON with schema validation

**How:**

```
make task-new id=003-feature-name title='Feature description' priority=High assignee='Name'
```

## 3. List Tasks

**Why:** View current work status across all categories

**What:** Filter tasks by status (TODO, IN_PROGRESS, DONE, REOPEN)

**How:**

```
make task-list [status=TODO] - omit status to see all tasks
```

## 4. View Task Details

**Why:** See full task information including subtasks and criteria

**What:** Display task metadata, acceptance criteria, subtasks, tags, files

**How:**

```
make task-show id=001-task-name - or click task card in web UI
```

## 5. Move Task Between Statuses

**Why:** Update task progress through workflow

**What:** Change task status with automatic history logging

**How:**

```
make task-move id=001-task-name to=IN_PROGRESS
```

## 6. Complete Task

**Why:** Mark work as finished

**What:** Move task to DONE status

**How:**

```
make task-done id=001-task-name - automatically logs completion
```

## 7. Reopen Task

**Why:** Handle incomplete or needs-rework tasks

**What:** Move DONE task to REOPEN status

**How:**

```
make task-reopen id=001-task-name
```

## 8. Task Schema Structure

**Why:** Understand task data model for editing

**What:** Required: id, title, status, created; Optional: priority, assignee, description, acceptanceCriteria, subtasks, tags, relatedFiles, notes

**How:**

```
See tasks/schema.json for full specification; edit task JSON files directly in tasks/data/{status}/
```

## 9. Web UI Task Management

**Why:** Visual task tracking and interaction

**What:** View tasks in doc-site with filtering, sorting, detail view

**How:**

```
Navigate to Tasks section in sidebar → filter by status → click card for details
```

## 10. Task Validation

**Why:** Ensure JSON integrity and schema compliance

**What:** Validate all task files against schema

**How:**

```
make task-validate - checks all tasks in all statuses
```

## 11. Acceptance Criteria & Subtasks

**Why:** Break down tasks into measurable outcomes

**What:** Define completion criteria and trackable sub-items

**How:**

```
Edit task JSON: add to acceptanceCriteria[] or subtasks[] arrays with {id, text, completed}
```

## 12. Task Best Practices

**Why:** Maintain clean and useful task system

**What:** Use descriptive IDs (001-feature-name), add acceptance criteria, link related files, tag appropriately

**How:**

```
Follow pattern: clear title → detailed description → acceptance criteria → subtasks → tags → related files
```
