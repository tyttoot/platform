
# 📌 Doc-Site Issue - START HERE

**Date**: December 22, 2025

## 🎯 What Happened

Your doc-site was showing **only 7 out of 12 guides** because the HTML navigation was **hardcoded** with missing guides.

**Root Cause**: Navigation not automatically generated from data folder → manual HTML update required.

---

## ✅ What Was Fixed

- ✅ Added 5 missing guides to HTML navigation
- ✅ Fixed AI Collaboration's data-page attribute
- ✅ All 12 guides now visible in sidebar
- ✅ Updated both index.html files (source and build)

**Guides that were missing and now added**:
1. Build & Deploy
2. Hosting Setup
3. Rollback Procedure
4. **Deployment Quick Guide** ⭐ (This was your problem!)
5. (Fixed AI Collaboration naming)

---

## 📚 Documentation Files Created

### For Understanding the Problem:
1. **DOC_SITE_RENDERING_ISSUE_ANALYSIS.md**
   - Complete root cause analysis
   - Why guides weren't showing
   - All 12 guides mapping
   - Detailed problem explanation

### For Adding Guides in the Future:
2. **DOC_SITE_ADDITION_CHECKLIST.md**
   - Step-by-step process
   - Critical reminders
   - All guides reference table
   - Don't forget: Must add HTML link!

### Existing References:
3. **DOC_SITE_CHECKLIST.md**
   - JSON format requirements (read this first!)
   - Common mistakes and fixes

---

## 🔑 The Key Lesson: DON'T FORGET

```
When adding ANY guide to doc-site:

Step 1: Create JSON file
  └─ /data/docs/guides/my-guide.json
  └─ Use DOC_SITE_CHECKLIST.md for format

Step 2: Validate JSON
  └─ make validate → Must pass

Step 3: UPDATE HTML NAVIGATION ⚠️⚠️⚠️
  └─ Edit: /www/index.html
  └─ Add: <li><a href="#" data-page="guideXxxx">Title</a></li>
  └─ Edit: /build-output/www/index.html (same)

Step 4: Verify
  └─ make serve → refresh → check sidebar

WITHOUT STEP 3 = GUIDE WON'T SHOW (even if JSON is perfect!)
```

---

## 🚀 Quick Start

### To Test the Fix:
```bash
make serve
# Refresh: http://localhost:8080/projects/doc-site/www/
# Check sidebar - should see all 12 guides
# Click "Deployment Quick Guide" - should render correctly
```

### To Add a New Guide:
```bash
# 1. Read the checklist first
cat /tmp/DOC_SITE_ADDITION_CHECKLIST.md

# 2. Follow the 6-step process
# 3. Don't skip the HTML link step!
```

---

## ✨ Files Modified Today

```
/projects/doc-site/www/index.html
  → Added 5 missing guides
  → Fixed AI Collaboration naming

/projects/doc-site/build-output/www/index.html
  → Same updates (keep in sync)
```

---

## 📌 Remember

- **Valid JSON ≠ Visible on Website** (need both)
- **Always update HTML** when adding guides
- **Refresh browser** to see changes
- **Check the checklist** before adding new guides
- **"Nhớ kỹ!"** (Remember well!) 🎯

---

**Next Step**: `make serve` and verify all 12 guides appear! ✅

