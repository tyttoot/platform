# Create an Entity

**Version:** v2.0.0
**Category:** guides
**Tags:** `entity`, `guide`, `starter`

Steps to create a new reusable entity in TYT Platform v2.

---

## 1. Name it generically

**Why:** Avoid project coupling

**What:** Pick a domain name (e.g., movement, camera, loader)

**How:**

```
Use lowercase file names; no project keywords
```

## 2. Place under entity/

**Why:** Shared across projects

**What:** entity/<domain>/<file>.js

**How:**

```
Keep logic pure; no DOM in shared entities unless UI domain
```

## 3. Define via tyt.define

**Why:** Merge-safe namespace

**What:** tyt.define(tyt, 'lib', { common: { ... } })

**How:**

```
Follow existing pattern in entity/common/...
```

## 4. ES5 only

**Why:** Compatibility

**What:** Avoid arrow functions, let/const, class

**How:**

```
Use function + var
```

## 5. Document intent (VN)

**Why:** Clarity

**What:** Add short VN comment for intent/constraints

**How:**

```
// Muc dich: ...
```

## 6. Wire require in lib/index

**Why:** Load order

**What:** Call tyt.require('lib/<path>') in entity/index.js

**How:**

```
Group requires near top
```
