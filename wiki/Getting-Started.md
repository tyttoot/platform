# Getting Started

**Version:** v2.0.0
**Category:** guides
**Tags:** `start`, `setup`, `doc-site`

Quick steps to run the doc-site and explore rules/guides/specs.

---

## 1. Install dependencies

**Why:** Need PHP/Node

**What:** PHP 8+, Node 16+

**How:**

```
Check with `php -v` and `node -v`
```

## 2. Start server

**Why:** Serve the doc-site

**What:** Run make serve

**How:**

```
make serve → opens http://localhost:8080/projects/doc-site/www/index.html
```

## 3. Navigate docs

**Why:** Read rules/guides/specs

**What:** Use sidebar links

**How:**

```
Click Rules/Guides/Specs to load JSON docs
```

## 4. Add a doc

**Why:** Extend content

**What:** Use make new-doc

**How:**

```
make new-doc category=guides slug=my-note; then edit JSON
```

## 5. Validate docs

**Why:** Catch schema issues

**What:** Run make validate

**How:**

```
Checks required fields (id/category/title) and items array
```
