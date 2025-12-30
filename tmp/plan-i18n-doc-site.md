# Plan: i18n Language Selector cho Doc-Site

> **Task ID**: 004-i18n-language-selector  
> **Created**: 2025-12-24  
> **Status**: IN_PROGRESS

---

## Mục tiêu

Thêm chức năng lựa chọn ngôn ngữ cho doc-site với 3 locales:
- `en` - English (default)
- `vi` - Tiếng Việt
- `zh-TW` - 中文（台灣）

**Approach**: Option B - Full localized docs (mỗi locale có bộ docs riêng)

---

## Architecture

```
projects/doc-site/data/
├── docs/                    # Canonical docs (fallback)
├── docs-manifest.json       # Canonical manifest (fallback)
└── locales/
    ├── en/
    │   ├── docs/            # English docs (copy từ canonical)
    │   └── docs-manifest.json
    ├── vi/
    │   ├── docs/            # Vietnamese docs (translated)
    │   └── docs-manifest.json
    └── zh-TW/
        ├── docs/            # Chinese TW docs (translated)
        └── docs-manifest.json
```

---

## Files thay đổi

### Entity (logic)
- `entity/common/i18n.js` - Module i18n (init, getLocale, setLocale, loadManifest, fetchDocForLocale)
- `entity/index.js` - Tích hợp i18n vào boot process

### Doc-Site (UI/config)
- `projects/doc-site/www/index.html` - Thêm `<select id="lang-select">`
- `projects/doc-site/www/define.js` - Config defaultLocale, supportedLocales

### Data
- `projects/doc-site/data/locales/{en,vi,zh-TW}/docs-manifest.json`
- `projects/doc-site/data/locales/{en,vi,zh-TW}/docs/` - Per-locale doc files

### Scripts
- `scripts/build_project.sh` - Copy locales vào build-output
- `scripts/prepare_locales.sh` - Scaffold locale folders
- `scripts/apply_translations.js` - Apply translation files

---

## Bug cần fix

### Bug 1: Code dùng ES6 (vi phạm Rule 20251207002)

**Vấn đề**:
- `entity/index.js` dùng `async function` (line ~265)
- `entity/common/i18n.js` dùng `Promise.resolve()` (ES6)

**Giải pháp**:
- Đổi `async function` → `function`
- Bỏ `Promise.resolve()`, chỉ dùng callback style

---

## Checklist

- [x] Tạo i18n module
- [x] Scaffold locales data
- [x] Thêm language selector UI
- [x] Wire selector
- [x] Update build scripts
- [ ] **Fix ES6 → ES5**
- [ ] Test doc-site
- [ ] Log history

---

## Commands

```bash
# Scaffold locale
bash scripts/prepare_locales.sh en

# Build
bash scripts/build_project.sh doc-site v2.1.0

# Test
make serve
# Mở http://localhost:8080/projects/doc-site/www/

# Validate
make validate

# Log history
make history-add msg="Added i18n language selector for doc-site"
```
