# AI Workflow (Detailed)

**Version:** v2.0.0
**Category:** guides
**Tags:** `ai`, `workflow`, `collaboration`

Detailed workflow for collaborating with AI on TYT Platform tasks.

---

## 1. State intent and scope

**Why:** Reduce ambiguity

**What:** Describe goal, files to touch, constraints

**How:**

```
Provide a short brief + acceptance criteria
```

## 2. Work in slices

**Why:** Safe increments

**What:** Ask for small steps and test after each

**How:**

```
Prefer small patches; run make validate or app-specific checks
```

## 3. Use automation

**Why:** Consistency

**What:** Use make serve/validate/new-doc/history-add

**How:**

```
Let AI hook into scripted flows
```

## 4. Keep entity generic

**Why:** Reusability

**What:** No project-specific names in entity/

**How:**

```
Review names vs. rules before merging
```

## 5. Log decisions

**Why:** Traceability

**What:** Record key changes in history

**How:**

```
make history-add action=... msg=...
```
