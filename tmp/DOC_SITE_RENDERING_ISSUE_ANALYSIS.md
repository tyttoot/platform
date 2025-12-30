# 🔍 Doc-Site Rendering Issue - Deep Analysis & Solutions

**Date**: December 22, 2025  
**Status**: ⚠️ CRITICAL - Multiple guides missing from navigation + rendering disabled  
**Priority**: HIGH - Affects all doc-site functionality

---

## 📋 Executive Summary

The doc-site is displaying **only 7 out of 12 guides** because:
1. **HTML Navigation NOT Updated** - index.html hardcoded, missing new guides
2. **Data-Page Attributes Hardcoded** - No dynamic loading from data folder
3. **Rendering System Not Integrated** - Pages loaded manually, not from JSON data

**Current Status**:
- ✅ 12 guides exist in `/data/docs/guides/` folder
- ❌ Only 7 guides visible in HTML navigation
- ❌ Missing: Build & Deploy, Hosting Setup, Rollback, Platform Automation, Deployment (still!)
- ❌ Page rendering appears to be stub/skeleton only

---

## 🎯 Problem #1: HTML Navigation is Hardcoded & Incomplete

### Current Guides in Data Folder (12 total):
```
guides/
├── ai-collaboration.json             ✅ In HTML
├── ai-workflow.json                  ✅ In HTML
├── build-and-deploy.json             ❌ NOT in HTML
├── create-entity.json                ✅ In HTML
├── create-project-template.json      ✅ In HTML
├── deployment-quick-guide.json       ❌ NOT in HTML (BIG PROBLEM!)
├── getting-started.json              ✅ In HTML
├── hosting-setup.json                ❌ NOT in HTML
├── platform-automation.json          ✅ In HTML
├── rollback-procedure.json           ❌ NOT in HTML
├── task-management.json              ✅ In HTML
└── testing.json                      ✅ In HTML
```

### Current HTML Navigation (7 guides):
```html
<li><a href="#" data-page="guideGettingStarted">Getting Started</a></li>
<li><a href="#" data-page="guides">AI Collaboration</a></li>
<li><a href="#" data-page="guideAIWorkflow">AI Workflow</a></li>
<li><a href="#" data-page="guideCreateEntity">Create Entity</a></li>
<li><a href="#" data-page="guideProjectTemplate">Project Template</a></li>
<li><a href="#" data-page="guidePlatformAutomation">Platform Automation</a></li>
<li><a href="#" data-page="guideTaskManagement">Task Management</a></li>
<li><a href="#" data-page="guideTesting">Testing</a></li>
```

### ❌ Missing from HTML:
- Build & Deploy Guide (`build-and-deploy.json` → needs `guideBuilddeploy`)
- Hosting Setup Guide (`hosting-setup.json` → needs `guideHostingSetup`)
- Rollback Procedure (`rollback-procedure.json` → needs `guideRollback`)
- **Deployment Quick Guide** (`deployment-quick-guide.json` → needs `guideDeploymentQuick`)

---

## 🎯 Problem #2: Data-Page Attribute Naming Mismatch

The HTML uses inconsistent naming patterns for `data-page` attributes:

### Mapping Issues:
| File | Expected Attribute | Current HTML | Status |
|------|-------------------|--------------|--------|
| getting-started.json | `guideGettingStarted` | ✅ Correct | ✅ OK |
| ai-collaboration.json | `guideAICollaboration` | ❌ `guides` | ❌ WRONG |
| ai-workflow.json | `guideAIWorkflow` | ✅ Correct | ✅ OK |
| build-and-deploy.json | `guideBuildDeploy` | ❌ MISSING | ❌ NOT IN HTML |
| create-entity.json | `guideCreateEntity` | ✅ Correct | ✅ OK |
| create-project-template.json | `guideProjectTemplate` | ✅ Correct | ✅ OK |
| deployment-quick-guide.json | `guideDeploymentQuick` | ❌ MISSING | ❌ NOT IN HTML |
| hosting-setup.json | `guideHostingSetup` | ❌ MISSING | ❌ NOT IN HTML |
| platform-automation.json | `guidePlatformAutomation` | ✅ Correct | ✅ OK |
| rollback-procedure.json | `guideRollback` | ❌ MISSING | ❌ NOT IN HTML |
| task-management.json | `guideTaskManagement` | ✅ Correct | ✅ OK |
| testing.json | `guideTesting` | ✅ Correct | ✅ OK |

---

## 🎯 Problem #3: Rendering System is NOT Dynamic

### Current Architecture Issues:

1. **No Dynamic Data Loading**
   - HTML navigation is hardcoded
   - No code to scan `/data/docs/guides/` folder
   - No code to auto-generate navigation links

2. **Page Routing Breaks for Missing Guides**
   - When user clicks "Build & Deploy" (if added to HTML), system looks for `guideBuildDeploy` page handler
   - No handler = blank page or error
   - No JSON loader to fetch and render the guide automatically

3. **Stub Implementation**
   - `define.js` only defines config, not rendering logic
   - `index.html` doesn't link to actual page rendering files
   - tyt.js exists but no doc-site specific page handlers

### Files Currently Missing:
- ❌ `/projects/doc-site/src/main/` (page handlers for rendering guides)
- ❌ Dynamic guide loader that reads from data folder
- ❌ Router that maps filename → data-page attribute
- ❌ Navigation generator that builds menu from data

---

## 🔧 Root Cause Analysis

### Why This Happened:
1. **Skeleton Only** - Doc-site is a minimal skeleton/template, not fully implemented
2. **Manual Maintenance** - HTML navigation must be manually updated when adding new guides
3. **No Automation** - No build script generates navigation from data folder
4. **Hardcoded Links** - All `data-page` attributes are hardcoded in index.html

### Why Deployment Guide Still Doesn't Show:
- ✅ JSON file created and fixed (correct format now)
- ✅ File validation passes
- ❌ **NOT added to HTML navigation** (still hardcoded)
- ❌ **No page handler** to render it
- ❌ Even if you click it, page would be blank

---

## ✅ Solution: Complete Checklist for Adding Guides to Doc-Site

### 3-Step Process to Add Any New Guide:

#### Step 1: Create/Fix JSON in Data Folder
```bash
cd /Users/norman/platform/projects/doc-site/data/docs/guides/
# File should exist with correct format (use DOC_SITE_CHECKLIST.md)
```

**File must have**:
- ✅ `id: "guides.xxxxx"`
- ✅ `items` array (not `sections`)
- ✅ `links` field
- ✅ All required fields

**Validate**:
```bash
make validate
# Should output: OK   projects/doc-site/data/docs/guides/FILENAME.json
```

#### Step 2: UPDATE HTML NAVIGATION (⚠️ CRITICAL - CURRENTLY MISSING!)
Edit: `/Users/norman/platform/projects/doc-site/www/index.html`

**Mapping Rule** (Important!):
- File: `my-guide-name.json`
- HTML attribute: `data-page="guideMyGuideName"` (camelCase)

**Add to HTML**:
```html
<li><a href="#" data-page="guideXxxxx">Display Name</a></li>
```

**Before Step 2 is done, website won't show the guide!**

#### Step 3: Verify Display
```bash
make serve
# Refresh: http://localhost:8080/projects/doc-site/www/
# Check sidebar for new guide
```

---

## 📝 Quick Reference: Current HTML Navigation Status

### ✅ Working (In HTML + In Data):
1. Getting Started (`guideGettingStarted`)
2. AI Collaboration (`guides`) ⚠️ Wrong attribute name
3. AI Workflow (`guideAIWorkflow`)
4. Create Entity (`guideCreateEntity`)
5. Project Template (`guideProjectTemplate`)
6. Platform Automation (`guidePlatformAutomation`)
7. Task Management (`guideTaskManagement`)
8. Testing (`guideTesting`)

### ❌ Missing from HTML (In Data but NOT in navigation):
1. **Build & Deploy** - File: `build-and-deploy.json` → Needs: `guideBuildDeploy`
2. **Hosting Setup** - File: `hosting-setup.json` → Needs: `guideHostingSetup`
3. **Rollback Procedure** - File: `rollback-procedure.json` → Needs: `guideRollback`
4. **Deployment Quick Guide** - File: `deployment-quick-guide.json` → Needs: `guideDeploymentQuick`

### ⚠️ Inconsistencies:
- AI Collaboration uses `guides` instead of `guideAICollaboration`

---

## 🎯 Why You Can't See Deployment Guide Yet

### Current Status:
- ✅ **JSON file exists**: `deployment-quick-guide.json`
- ✅ **JSON format correct**: id = "guides.deployment-quick-guide", items array, links field
- ✅ **File validates**: `make validate` → OK
- ❌ **NOT in HTML navigation**: Missing from index.html
- ❌ **No page handler**: No code to render it even if clicked

### What Needs to Happen:
```html
<!-- ADD THIS to index.html line 65 (in Guides section) -->
<li><a href="#" data-page="guideDeploymentQuick">Deployment Quick Guide</a></li>
```

Then:
```bash
make serve
# Refresh browser
# Now "Deployment Quick Guide" appears in sidebar
# Click it → Should render the guide
```

---

## 📋 The Real Problem: No Dynamic System

The doc-site needs **one of two solutions**:

### Option A: Automation (Better Long-term)
Create a build script that:
1. Scans `/data/docs/guides/` folder
2. Extracts file names and titles from JSON
3. Generates `index.html` navigation automatically
4. Runs on: `make serve` or `make build`

**Benefit**: Add new guide → auto-appears in menu (no manual HTML edits)

### Option B: Manual Process (Current)
Every time you add a guide:
1. Create JSON in `/data/docs/guides/xxx.json`
2. **Manually edit** `/www/index.html` to add `<li>` link
3. **Run** `make validate`
4. **Verify** with `make serve`

**Current system uses Option B** (explains why deployment guide doesn't show!)

---

## 🚨 Critical Note: Why Deployment Guide Shows "Fixed" But Isn't Visible

### What Happened:
1. ✅ Created deployment-quick-guide.json (with correct format)
2. ✅ Fixed JSON structure (id, items, links)
3. ✅ Runs `make validate` → OK
4. ❌ **Forgot Step 2: Update index.html navigation**
5. ❌ Even though JSON is perfect, website doesn't know it exists

### The Lesson:
**"Valid JSON ≠ Visible on Website"**
- Valid JSON = passes validation ✅
- Visible on Website = requires HTML navigation link ✅

Both needed for deployed guide to appear!

---

## 📌 Summary Checklist: Before Adding ANY Guide to Doc-Site

### MUST DO (in order):
- [ ] 1. JSON file exists in `/data/docs/guides/xxx.json`
- [ ] 2. JSON has correct format (id, items, links, etc.)
- [ ] 3. **RUN: `make validate`** → Must say OK
- [ ] 4. **EDIT: `/www/index.html`** → Add `<li>` link in correct section
- [ ] 5. **RUN: `make serve`** → Browser opens
- [ ] 6. **REFRESH: Browser** → Look for new guide in sidebar
- [ ] 7. **CLICK: New guide link** → Should render content
- [ ] 8. **RUN: `git add -A`** → Add all files
- [ ] 9. **RUN: `git commit`** → Commit with message
- [ ] 10. **RUN: `make push`** → Push to repository

### DON'T FORGET:
- ⚠️ **Step 4 is Critical** - Without it, guide won't appear even if JSON is perfect
- ⚠️ **Validate before HTML edit** - Ensure JSON is correct first
- ⚠️ **Refresh browser** - Changes require browser refresh to see

---

## 🎓 Lessons Learned

| Problem | Solution | Remember |
|---------|----------|----------|
| Deployment guide not showing | Add to index.html | Don't just create JSON, update HTML too |
| Only 7/12 guides visible | Check HTML navigation | JSON file ≠ Website visibility |
| New guides disappear | Manual update required | No automation → manual maintenance |
| Pages don't load | Check data-page attribute name | Must match camelCase pattern |
| Validation passes but nothing shows | Still need HTML link | Validation ≠ Visibility |

---

## 🚀 Next Steps

### Immediate (Today):
1. ✅ Fix deployment guide visibility by adding to `index.html`
2. ✅ Verify all 12 guides appear in sidebar
3. ✅ Test clicking each guide loads correct content
4. ✅ Commit all changes

### Soon (This Sprint):
- Consider building automation script to generate HTML navigation from data folder
- Document this process in team wiki
- Create template/generator for new guides

### Future (Next Version):
- Build dynamic guide loading system (scan folder, auto-generate menu)
- Implement page handler architecture
- Remove hardcoded navigation from HTML

---

## 📚 Related Documents

- [DOC_SITE_CHECKLIST.md](DOC_SITE_CHECKLIST.md) - JSON format requirements
- [deployment-quick-guide.json](../projects/doc-site/data/docs/guides/deployment-quick-guide.json) - The fixed guide file
- [index.html](../projects/doc-site/www/index.html) - Navigation file (needs update)

---

**Last Updated**: 2025-12-22  
**Status**: Analysis Complete - Ready for Implementation
