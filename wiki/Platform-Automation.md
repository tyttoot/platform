# Platform Automation

**Version:** v2.0.0
**Category:** guides
**Tags:** `automation`, `makefile`, `scripts`, `templates`, `workflow`

Complete guide to TYT Platform v2 automation tools, commands, and workflows for efficient development.

---

## 1. Server Management

**Why:** Quick dev server control

**What:** Start/stop/status PHP server for local development

**How:**

```
make serve (start+open), make stop, make status
```

## 2. Documentation Workflow

**Why:** Manage doc-site content efficiently

**What:** Scaffold, validate, and version documentation

**How:**

```
make new-doc category=guides slug=my-note; make validate
```

## 3. Entity Scaffolding

**Why:** Fast entity module creation with consistent patterns

**What:** Generate entity modules from ES5 templates

**How:**

```
make new-entity name=storage category=common description='Storage helper'
```

## 4. Project Scaffolding

**Why:** Quick project initialization with standard structure

**What:** Generate complete project structure (www/, data/, deploy/)

**How:**

```
make new-project name=my-app → opens skeleton at projects/my-app/
```

## 5. History Logging

**Why:** Track all platform actions and changes

**What:** Append timestamped entries to logs/history.jsonl

**How:**

```
make history-add action='feature:add' msg='Description'; make history-show
```

## 6. Version Management

**Why:** Semantic versioning with git tags and changelog

**What:** Create git tags, update HISTORY.md automatically

**How:**

```
make version tag=v2.1.0 msg='Feature release'
```

## 7. Validation Scripts

**Why:** Catch doc schema errors early

**What:** Check JSON docs for required fields (id/category/title/items)

**How:**

```
make validate → runs scripts/validate_docs.js
```

## 8. Templates Structure

**Why:** Reusable patterns for consistency

**What:** Entity: templates/entity-template/; Project: templates/project-template/

**How:**

```
Customize templates/*.template files; placeholders: {{NAME}}, {{CATEGORY}}, {{DESCRIPTION}}
```

## 9. Complete Makefile Commands

**Why:** Single source of truth for automation

**What:** All available make targets documented

**How:**

```
make help → lists: serve, stop, status, open-doc, validate, new-doc, new-entity, new-project, version, history-add, history-show
```

## 10. Workflow Best Practices

**Why:** Efficient development cycle

**What:** 1) make serve → 2) create entity/project → 3) validate → 4) log history → 5) version tag

**How:**

```
Always validate before committing; log significant changes; use templates for consistency
```
