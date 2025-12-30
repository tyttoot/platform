# TYT Platform Architecture

**Version:** v2.0.0
**Category:** specs
**Tags:** `spec`, `architecture`, `loader`, `entity`

High-level architecture of TYT Platform v2 (loader, entity libs, projects).

---

## 1. Loader (tyt.js)

**Why:** Single entry

**What:** define/require/exec/router/main/log

**How:**

```
Projects set srcConfig; loader sets directories and runs lib/index
```

## 2. Shared libs (entity/)

**Why:** Reuse across projects

**What:** common/, ui/, render/, physics/, etc.

**How:**

```
Generic naming, ES5, no project coupling
```

## 3. Projects/ www/

**Why:** Isolation per app

**What:** Each project has www with define.js, index.html/css, src/

**How:**

```
Config via tyt.srcConfig; assets local
```

## 4. Data-driven docs

**Why:** Configurable content

**What:** JSON docs under projects/doc-site/data/docs

**How:**

```
Loaded via dataLoader, rendered via render helpers
```

## 5. Automation

**Why:** Consistency

**What:** Makefile + scripts for serve/history/validate/scaffold

**How:**

```
Use history_log.sh and future validate/new-doc
```
