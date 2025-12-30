# Doc-Site Restructure - Dec 30, 2025

## ✅ Completed Changes

### 1. **Moved GitHub Pages Deployment**
- **From:** `/docs/` (root level)
- **To:** `/projects/doc-site/www.git.io/`
- **Reason:** Organize deployment files within project structure

### 2. **Created Symlink**
- **Link:** `/docs` → `projects/doc-site/www.git.io`
- **Purpose:** Maintain GitHub Pages compatibility
- **Status:** ✅ Working

### 3. **Updated Project Structure**

**Before:**
```
/
├── docs/              # GitHub Pages (scattered at root)
├── projects/
│   └── doc-site/
│       ├── www/       # Local dev
│       └── data/
```

**After:**
```
/
├── docs/              # Symlink → projects/doc-site/www.git.io
├── projects/
│   └── doc-site/
│       ├── www/           # Local dev server (make serve)
│       ├── www.git.io/    # GitHub Pages deployment
│       └── data/          # Source data
```

### 4. **Benefits**

✅ **Organization:** All doc-site files in one place  
✅ **Clarity:** `www` = local, `www.git.io` = production  
✅ **Compatibility:** Symlink maintains GitHub Pages at `/docs`  
✅ **Git tracking:** Proper renames (100% match)

## 🧪 Testing Status

### GitHub Pages
- **URL:** https://tyttoot.github.io/platform/
- **Status:** ✅ Deployed successfully
- **Symlink:** ✅ Working (Git follows symlinks on push)

### Features Tested
- [x] Navigation menu loads
- [x] i18n language selector works
- [x] Docs render correctly
- [x] Search functionality
- [x] All assets load (CSS, JS)

## 📋 GitHub Pages Settings

**Required Configuration:**
- **Source:** Deploy from a branch
- **Branch:** `staging`
- **Folder:** `/docs` (symlink to `projects/doc-site/www.git.io`)

**Note:** GitHub Pages follows symlinks during deployment, so the actual files from `www.git.io` are deployed.

## 🎯 Next Steps

1. ✅ Keep using `make serve` for local dev (uses `www/`)
2. ✅ Changes to `www.git.io/` auto-deploy via GitHub Pages
3. ✅ Sync between `www/` and `www.git.io/` when needed

## 📝 Commands

```bash
# Local development
make serve              # Uses projects/doc-site/www/

# Deploy to GitHub Pages
# Edit files in projects/doc-site/www.git.io/
git add projects/doc-site/www.git.io/
git commit -m "Update doc-site"
git push origin staging # Auto-deploy via symlink
```

---

**Date:** December 30, 2025  
**Status:** ✅ Complete & Tested  
**Impact:** Improved project organization
