# Create Project Template

**Version:** v2.0.0
**Category:** guides
**Tags:** `project`, `template`, `guide`

How to create a reusable project template using TYT Platform.

---

## 1. Clone template structure

**Why:** Fast bootstrap

**What:** projects/template/ with www/, define.js, index.html/css

**How:**

```
Copy folder, rename, adjust define.js
```

## 2. Set srcConfig

**Why:** Loader needs paths

**What:** projectName, mode, currentPage, logKeys

**How:**

```
Edit www/define.js
```

## 3. Wire entity requires

**Why:** Load shared libs

**What:** Add tyt.require calls in entity/index.js for needed libs

**How:**

```
Follow existing pattern
```

## 4. Add sample page

**Why:** Sanity check

**What:** Create www/src/<page>/index.js

**How:**

```
Render a hello state; use dataLoader/render as needed
```

## 5. Document usage

**Why:** Onboarding

**What:** Add a guide JSON entry for the template

**How:**

```
Use make new-doc to add docs/guides
```
