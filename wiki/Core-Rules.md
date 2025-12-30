# Core Platform Rules

**Version:** v2.0.0
**Category:** rules
**Tags:** `core`, `platform`, `entity`, `docs`, `automation`

Initial core rules for the TYT Platform v2. These define how we structure code, name things, document, and automate.

---

## 1. Language & Comments

**Why:** Consistency and accessibility for mixed audiences.

**What:** Code in English; comments in Vietnamese.

**How:**

```
Functions, variables, modules use clear English names; add VN comments for intent and constraints.
```

## 2. Folder Structure

**Why:** Single mold across web/app/mobile.

**What:** Root contains: entity/, projects/, scripts/, logs/, tmp/, Makefile.

**How:**

```
Shared code in entity/; project-specific in projects/<name>/www; automation in scripts/; history in logs/.
```

## 3. Naming (Generic & Reusable)

**Why:** Avoid project coupling; maximize reuse.

**What:** Function/class names must be generic (no project-specific terms) within entity/.

**How:**

```
Prefer dataLoader, renderer, screen, etc.; avoid biggerdot-specific names in entity/.
```

## 4. JavaScript Standard

**Why:** Cross-platform compatibility.

**What:** Use ES5-compatible JavaScript.

**How:**

```
Avoid modern syntax that breaks older environments; transpile later if needed.
```

## 5. Platform Loader Pattern

**Why:** Unified runtime behavior.

**What:** Use tyt.define/tyt.require/tyt.exec/tyt.router with shared libs in entity/.

**How:**

```
Projects define tyt.srcConfig in define.js; loader sets directories and executes lib/index().
```

## 6. Documentation Data

**Why:** Searchable, composable, and renderable docs.

**What:** Docs are JSON under projects/doc-site/data/docs/.

**How:**

```
Each item: {id, version, category, title, content, tags[], links[]}; follow schema.json.
```

## 7. Automation & History

**Why:** Speed, repeatability, and audit trail.

**What:** Use Makefile tasks; log actions to logs/history.jsonl.

**How:**

```
make serve/stop/status/open-doc auto-log; use make history-add for manual entries.
```

## 8. No External Frameworks

**Why:** Simplicity and portability.

**What:** Pure HTML/CSS/JS in projects; small utilities in entity/.

**How:**

```
Avoid React/Vue/etc.; keep DOM and CSS minimal.
```

## 9. Versioning

**Why:** Track evolution and enable rollbacks.

**What:** Use git tags for releases; maintain HISTORY via logs/history.jsonl.

**How:**

```
Tag doc-site/content versions (e.g., v2.0.0); record changes with make history-add.
```
