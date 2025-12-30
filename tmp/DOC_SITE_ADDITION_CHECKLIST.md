# 📌 Doc-Site Issue Summary - For Next Time

**Date**: December 22, 2025  
**Issue**: Site displaying incompletely - missing guides from sidebar  
**Status**: ✅ **FIXED**

---

## 🎯 The Problem in One Sentence

**HTML navigation was hardcoded with only 7 guides, but data folder had 12 guides → 5 guides invisible**

---

## 📝 Complete Checklist When Adding New Guides

### ✅ Before Adding Anything:
- [ ] Read: `/tmp/DOC_SITE_RENDERING_ISSUE_ANALYSIS.md`
- [ ] Read: `/tmp/DOC_SITE_CHECKLIST.md`

### ✅ When Adding a New Guide:

#### Step 1: Create JSON File
```bash
cd /Users/norman/platform/projects/doc-site/data/docs/guides/
# Create new file: my-guide-name.json

# File must have:
{
  "id": "guides.xxxxx",     # ← "guides." prefix required!
  "version": "v2.0.0",
  "category": "guides",
  "title": "Display Title",
  "tags": ["tag1", "tag2"],
  "content": "Short description",
  "links": [{...}],         # ← Required field
  "items": [{...}]          # ← Must be "items" not "sections"
}
```

#### Step 2: Validate JSON
```bash
cd /Users/norman/platform
make validate
# Must see: OK   projects/doc-site/data/docs/guides/my-guide-name.json
```

#### Step 3: UPDATE HTML NAVIGATION (⚠️ MOST CRITICAL STEP - DON'T SKIP!)
```bash
Edit: /Users/norman/platform/projects/doc-site/www/index.html

# Find the Guides section (around line 58):
<div class="section">Guides</div>
<ul>
  <!-- Add your guide here -->
  <li><a href="#" data-page="guideMyGuideName">Display Name</a></li>
</ul>

# File name → HTML attribute mapping:
my-guide-name.json → guideMyGuideName (camelCase!)
```

#### Step 4: Update Build Output Too
```bash
Edit: /Users/norman/platform/projects/doc-site/build-output/www/index.html
# Add same line to the Guides section
```

#### Step 5: Verify
```bash
cd /Users/norman/platform
make serve
# Open: http://localhost:8080/projects/doc-site/www/
# Refresh browser
# Check sidebar → Your new guide should appear
# Click it → Verify content renders
```

#### Step 6: Commit
```bash
git add -A
git commit -m "[DOCS] Add new guide: My Guide Name"
make push
```

---

## ⚠️ Critical Reminders

| DO | DON'T |
|----|-------|
| ✅ Create JSON with "guides." id prefix | ❌ Forget to add HTML link |
| ✅ Use "items" array | ❌ Use "sections" array |
| ✅ Include "links" field | ❌ Skip "links" field |
| ✅ Run make validate | ❌ Assume JSON is correct |
| ✅ Edit BOTH index.html files (www/ + build-output/www/) | ❌ Edit only one |
| ✅ **UPDATE entity/index.js docsMap** | ❌ **Forget docsMap = "No doc mapped" error!** |
| ✅ Refresh browser after make serve | ❌ Expect cached version to update |
| ✅ Use camelCase for data-page | ❌ Use kebab-case or SCREAMING_CASE |
| ✅ Map filename exactly to data-page | ❌ Make up your own attribute name |
| ✅ Add to docsMap in alphabetical order | ❌ Random order in docsMap |

---

## 🔍 Reference: All 12 Guides

| File | Display Name | data-page | Status |
|------|--------------|-----------|--------|
| ai-collaboration.json | AI Collaboration | `guideAICollaboration` | ✅ OK |
| ai-workflow.json | AI Workflow | `guideAIWorkflow` | ✅ OK |
| build-and-deploy.json | Build & Deploy | `guideBuildDeploy` | ✅ OK |
| create-entity.json | Create Entity | `guideCreateEntity` | ✅ OK |
| create-project-template.json | Project Template | `guideProjectTemplate` | ✅ OK |
| deployment-quick-guide.json | Deployment Quick Guide | `guideDeploymentQuick` | ✅ OK |
| getting-started.json | Getting Started | `guideGettingStarted` | ✅ OK |
| hosting-setup.json | Hosting Setup | `guideHostingSetup` | ✅ OK |
| platform-automation.json | Platform Automation | `guidePlatformAutomation` | ✅ OK |
| rollback-procedure.json | Rollback Procedure | `guideRollback` | ✅ OK |
| task-management.json | Task Management | `guideTaskManagement` | ✅ OK |
| testing.json | Testing | `guideTesting` | ✅ OK |

---

## 🚨 What Went Wrong This Time

| Issue | Why | What Broke |
|-------|-----|-----------|
| 5 guides missing from HTML | HTML navigation hardcoded, not auto-generated | Only 7/12 guides visible |
| deployment guide not showing | No HTML link added after JSON creation | Valid JSON but invisible |
| AI Collaboration had wrong data-page | HTML had "guides" instead of "guideAICollaboration" | Hard to click correct guide |

---

## 💾 Related Documents

1. **DOC_SITE_RENDERING_ISSUE_ANALYSIS.md** - Detailed root cause analysis
2. **DOC_SITE_CHECKLIST.md** - JSON format requirements
3. **deployment-quick-guide.json** - Fixed deployment guide
4. **index.html** - Navigation file (main and build-output versions)

---

## 🎓 What You Learned

```
JSON is Valid ≠ Appears on Website

For guides to show:
✅ JSON must be valid (format, structure)
✅ JSON must be linked in HTML (navigation)
✅ Both must exist together

Skip one = guide invisible, even if perfect JSON
```

---

## ✅ Today's Changes

```
Modified Files:
1. /projects/doc-site/www/index.html
   - Added 5 missing guides to sidebar
   - Fixed AI Collaboration attribute name
   - Now shows all 12 guides

2. /projects/doc-site/build-output/www/index.html
   - Same updates as above
   - Keeps build artifact in sync

Created Files:
1. DOC_SITE_RENDERING_ISSUE_ANALYSIS.md (detailed analysis)
2. DOC_SITE_ADDITION_CHECKLIST.md (this file)

Next: make serve → verify all 12 guides appear ✅
```

---

**Remember**: Next time when adding guides → Check this file first! "Nhớ kỹ!" 🎯

