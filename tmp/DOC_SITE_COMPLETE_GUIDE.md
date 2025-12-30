# 📌 Doc-Site Complete Guide - How to Add Guides (UPDATED Dec 22, 2025)

**Date**: December 22, 2025 - **CRITICAL UPDATE**  
**Issue Found**: "No doc mapped for guideBuildDeploy" error  
**Root Cause**: Missing docsMap entries in entity/index.js  
**Status**: ✅ **FIXED + DOCUMENTED**

---

## 🚨 CRITICAL: 3 Parts Required for Each Guide

For a guide to work on doc-site, you need **ALL 3 PARTS**:

1. ✅ **JSON file** in `/data/docs/guides/xxx.json`
2. ✅ **HTML link** in `/www/index.html` 
3. ✅ **docsMap entry** in `/entity/index.js` ⚠️ **NEW - Don't forget this!**

**Missing ANY of these = Guide won't work!**

---

## 📝 Complete 7-Step Checklist

### Step 1: Create JSON File ✅

```bash
cd /Users/norman/platform/projects/doc-site/data/docs/guides/
# Create: my-guide-name.json
```

**Required JSON structure**:
```json
{
  "id": "guides.my-guide-name",
  "version": "v2.0.0",
  "category": "guides",
  "title": "My Guide Title",
  "tags": ["tag1", "tag2"],
  "content": "Short description",
  "links": [
    {"text": "Related Guide", "url": "#guides.other-guide"}
  ],
  "items": [
    {
      "id": "MG-01",
      "title": "Step 1",
      "why": "Reason for this step",
      "what": "What to do",
      "how": "How to do it"
    }
  ]
}
```

**Critical rules**:
- ✅ `id` must have "guides." prefix
- ✅ Must use `"items"` array (NOT "sections")
- ✅ Must have `"links"` field (even if empty array)
- ✅ Each item needs: id, title, why, what, how

---

### Step 2: Validate JSON ✅

```bash
cd /Users/norman/platform
make validate
```

**Expected output**:
```
OK   projects/doc-site/data/docs/guides/my-guide-name.json
```

If validation fails, check DOC_SITE_CHECKLIST.md for format rules.

---

### Step 3: Update HTML Navigation ✅

**File**: `/Users/norman/platform/projects/doc-site/www/index.html`

Find the Guides section (around line 58-69):
```html
<div class="section">Guides</div>
<ul>
  <!-- Add in ALPHABETICAL ORDER -->
  <li><a href="#" data-page="guideMyGuideName">My Guide Title</a></li>
</ul>
```

**Naming convention**:
- File: `my-guide-name.json`
- data-page: `guideMyGuideName` (camelCase, starts with "guide")

---

### Step 4: Update docsMap in entity/index.js ⚠️⚠️⚠️ CRITICAL!

**File**: `/Users/norman/platform/entity/index.js`

Find the `docsMap` object (around line 246):
```javascript
var docsMap = {
  rules: base + '../data/docs/rules/core-rules.json',
  // Add in ALPHABETICAL ORDER
  guideMyGuideName: base + '../data/docs/guides/my-guide-name.json',
  ...
};
```

**IMPORTANT**:
- ✅ Key name MUST match `data-page` from HTML exactly
- ✅ Path points to JSON file
- ✅ Add in alphabetical order for readability
- ❌ **Without this = "No doc mapped for guideMyGuideName" error!**

**Complete mapping example**:
```javascript
// File: my-guide-name.json
// HTML: data-page="guideMyGuideName"
// docsMap: guideMyGuideName: base + '../data/docs/guides/my-guide-name.json'
```

---

### Step 5: Update Build Output HTML ✅

**File**: `/Users/norman/platform/projects/doc-site/build-output/www/index.html`

Add the same `<li>` line from Step 3 to this file's Guides section.

---

### Step 6: Verify It Works ✅

```bash
cd /Users/norman/platform
make serve
```

Then:
1. Open: http://localhost:8080/projects/doc-site/www/
2. **Refresh browser** (Ctrl+R or Cmd+R)
3. Check sidebar under "Guides" → Your guide should appear
4. **Click the guide link**
5. Should render content (NOT "No doc mapped" error!)
6. Should display all items from JSON

**If you see "No doc mapped for guideXxxx"**:
→ You forgot Step 4 (docsMap in entity/index.js)!

---

### Step 7: Commit Changes ✅

```bash
cd /Users/norman/platform
git add -A
git commit -m "[DOCS] Add guide: My Guide Title

- Added my-guide-name.json
- Updated HTML navigation
- Added docsMap entry in entity/index.js
"
make push
```

---

## ⚠️ Common Mistakes & How to Avoid

| Mistake | Result | Solution |
|---------|--------|----------|
| Forgot to add docsMap entry | "No doc mapped for guideXxxx" | Add to entity/index.js docsMap |
| Wrong data-page name | "No doc mapped" or link doesn't work | Must match docsMap key exactly |
| Forgot HTML link | Guide not in sidebar | Add to www/index.html |
| Used "sections" instead of "items" | Validation fails or rendering broken | Use "items" array |
| Missing "guides." prefix in id | Doc-site may not recognize it | Use "guides.xxx" format |
| Forgot to refresh browser | See old version | Always refresh after make serve |
| Only updated one index.html | Build output has old version | Update both www/ and build-output/ |

---

## 🔍 Debugging Guide

### Problem: "No doc mapped for guideXxxx"

**Cause**: Missing docsMap entry in entity/index.js

**Fix**:
1. Open `/entity/index.js`
2. Find `var docsMap = {` (line ~246)
3. Add: `guideXxxx: base + '../data/docs/guides/xxx.json',`
4. Save and refresh browser

---

### Problem: Guide not in sidebar

**Cause**: Missing HTML link

**Fix**:
1. Open `/www/index.html`
2. Find `<div class="section">Guides</div>`
3. Add: `<li><a href="#" data-page="guideXxx">Title</a></li>`
4. Also update `/build-output/www/index.html`
5. Refresh browser

---

### Problem: Validation fails

**Cause**: Wrong JSON format

**Fix**:
1. Check `/tmp/DOC_SITE_CHECKLIST.md` for format
2. Ensure "guides." prefix in id
3. Use "items" not "sections"
4. Add "links" field
5. Run `make validate` again

---

## 📋 Reference: All 12 Current Guides

All guides now have **3 parts** (JSON + HTML + docsMap):

| # | File | data-page | Display Name | Status |
|---|------|-----------|--------------|--------|
| 1 | getting-started.json | `guideGettingStarted` | Getting Started | ✅ |
| 2 | ai-collaboration.json | `guideAICollaboration` | AI Collaboration | ✅ |
| 3 | ai-workflow.json | `guideAIWorkflow` | AI Workflow | ✅ |
| 4 | build-and-deploy.json | `guideBuildDeploy` | Build & Deploy | ✅ FIXED |
| 5 | create-entity.json | `guideCreateEntity` | Create Entity | ✅ |
| 6 | create-project-template.json | `guideProjectTemplate` | Project Template | ✅ |
| 7 | deployment-quick-guide.json | `guideDeploymentQuick` | Deployment Quick Guide | ✅ FIXED |
| 8 | hosting-setup.json | `guideHostingSetup` | Hosting Setup | ✅ FIXED |
| 9 | platform-automation.json | `guidePlatformAutomation` | Platform Automation | ✅ |
| 10 | rollback-procedure.json | `guideRollback` | Rollback Procedure | ✅ FIXED |
| 11 | task-management.json | `guideTaskManagement` | Task Management | ✅ |
| 12 | testing.json | `guideTesting` | Testing | ✅ |

---

## 💡 Quick Reminder - The 3 Required Parts

```
For guide "my-guide-name":

Part 1: JSON File
└─ /data/docs/guides/my-guide-name.json

Part 2: HTML Link  
└─ /www/index.html
   <li><a href="#" data-page="guideMyGuideName">Title</a></li>

Part 3: docsMap Entry ⚠️ DON'T FORGET!
└─ /entity/index.js
   guideMyGuideName: base + '../data/docs/guides/my-guide-name.json',

Missing ANY = Guide won't work!
```

---

## 📚 Related Documentation

- `/tmp/DOC_SITE_CHECKLIST.md` - JSON format requirements
- `/tmp/DOC_SITE_RENDERING_ISSUE_ANALYSIS.md` - Deep analysis
- `/tmp/00_START_HERE.md` - Quick overview

---

## ✅ Verification Checklist

Before committing, verify:

- [ ] JSON file created in `/data/docs/guides/`
- [ ] JSON validation passes (`make validate` → OK)
- [ ] HTML link added to `/www/index.html`
- [ ] HTML link added to `/build-output/www/index.html`
- [ ] **docsMap entry added to `/entity/index.js`** ⚠️
- [ ] data-page name matches docsMap key exactly
- [ ] `make serve` runs without errors
- [ ] Browser refreshed
- [ ] Guide appears in sidebar
- [ ] **Clicking guide shows content (NOT "No doc mapped")**
- [ ] All items render correctly

If all ✅ → Ready to commit!

---

**Remember**: "Nhớ kỹ!" - Don't forget the docsMap entry in entity/index.js!

**Last Updated**: December 22, 2025 - Added Step 4 (docsMap requirement)
