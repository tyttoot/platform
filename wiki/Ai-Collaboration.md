# AI Collaboration Guide

**Version:** v2.0.0
**Category:** guides
**Tags:** `ai`, `workflow`, `rules`, `productivity`

How to work with AI effectively in the TYT Platform workflow.

---

## 1. Context & Plan First

**Why:** AI needs clear scope to avoid rework.

**What:** Always share goal, scope, constraints, and the target files/paths upfront.

**How:**

```
Provide: objective, expected outputs, touched files, and acceptance criteria before coding.
```

## 2. Small, Reviewable Steps

**Why:** Reduces risk and makes review easy.

**What:** Prefer small patches and quick tests instead of large diffs.

**How:**

```
Implement feature slices; run quick checks; summarize changes and next steps.
```

## 3. Use Automation

**Why:** Consistency and speed.

**What:** Use Makefile/scripts for repetitive tasks; log actions in history.

**How:**

```
`make serve`, `make history-add`, future `make validate`/`new-entity`.
```

## 4. Respect Core Rules

**Why:** Keeps platform generic and reusable.

**What:** Follow core rules on naming, ES5, folder structure, no external frameworks.

**How:**

```
Check rules JSON before adding modules; keep entity/ generic.
```

## 5. Communicate Uncertainty

**Why:** Avoid silent mistakes.

**What:** If blocked or unsure, ask or log assumptions.

**How:**

```
Add to history or notes when making assumptions; propose options.
```
