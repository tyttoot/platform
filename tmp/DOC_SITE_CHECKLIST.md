# 📝 DOC-SITE ADDITION CHECKLIST

**IMPORTANT: Đừng quên những bước này khi thêm guides/docs vào doc-site!**

---

## ✅ Khi Tạo File JSON Mới cho Doc-Site

### Format JSON - PHẢI CÓ NHỮNG FIELD NÀY:

```json
{
  "id": "guides.xxxxx",           // ⚠️ PHẢI có "guides." prefix!
  "version": "v2.0.0",            // ✅ Version của guide
  "category": "guides",           // ✅ guides | rules | specs
  "title": "Tên hướng dẫn",       // ✅ Tiêu đề rõ ràng
  "tags": ["tag1", "tag2"],       // ✅ Keywords để tìm kiếm
  "content": "Mô tả ngắn",         // ✅ Preview text
  "links": [
    {"text": "Link name", "url": "#guides.other-guide"}  // ✅ Liên kết tới guides khác
  ],
  "items": [                      // ✅ PHẢI CÓ ITEMS ARRAY
    {
      "id": "DQ-01",
      "title": "Bước 1",
      "why": "Tại sao làm?",
      "what": "Cái gì làm?",
      "how": "Làm sao?"
    }
  ]
}
```

### ⚠️ Những Lỗi Thường Gặp:

| Lỗi | Cách Fix |
|-----|---------|
| ❌ `"id": "guides-xxxxx"` (dấu gạch) | ✅ `"id": "guides.xxxxx"` (dấu chấm) |
| ❌ Không có `items` array | ✅ Phải có `items: [...]` |
| ❌ Không có `links` field | ✅ Thêm `links: [...]` |
| ❌ Field `sections` thay vì `items` | ✅ Dùng `items` |
| ❌ Không có `version` field | ✅ Thêm `"version": "v2.0.0"` |

---

## 🔄 Quy Trình Thêm Doc (Step-by-Step)

### Bước 1: Tạo File JSON
```bash
cd /Users/norman/platform/projects/doc-site/data/docs/guides/
cat > my-new-guide.json << 'EOF'
{
  "id": "guides.my-new-guide",
  "version": "v2.0.0",
  "category": "guides",
  "title": "Hướng dẫn mới",
  "tags": ["tag1", "tag2"],
  "content": "Mô tả guide",
  "links": [{"text": "Related", "url": "#guides.other"}],
  "items": [
    {"id": "MG-01", "title": "Step 1", "why": "Why?", "what": "What?", "how": "How?"}
  ]
}
EOF
```

### Bước 2: Validate JSON
```bash
make validate
# OUTPUT: OK   projects/doc-site/data/docs/guides/my-new-guide.json
```

### Bước 3: Thêm Link vào Platform Rules (nếu cần)
```bash
# Edit: document/platform-rules.md
# Thêm link tới guide mới trong phần deployment/documentation
```

### Bước 4: Commit lên Git
```bash
git add -A
git commit -m "[DOCS] Add my-new-guide to doc-site"
git push origin main
```

### Bước 5: Refresh Doc-Site
```bash
make serve
# Visit: http://localhost:8080/projects/doc-site/www/
# Refresh browser (Cmd+R or Ctrl+R)
```

---

## 📋 CHECKLIST - Bạn đã làm những gì?

Mỗi lần thêm guides, phải kiểm tra:

- [ ] File JSON có `id: "guides.xxxxx"` (với dấu chấm)
- [ ] File JSON có `items` array (KHÔNG phải `sections`)
- [ ] File JSON có `links` field linking tới guides khác
- [ ] File JSON có đúng format (xem template ở trên)
- [ ] Chạy `make validate` - kết quả là `OK`
- [ ] Thêm link vào platform-rules.md (nếu cần)
- [ ] `git add -A`
- [ ] `git commit -m "[DOCS] Add guide name"`
- [ ] `git push origin <branch>`
- [ ] `make serve` + refresh browser để verify

---

## 🔍 Cách Verify Guide Hiển Thị Đúng

### Method 1: Qua Doc-Site Web
```bash
# 1. Start server
make serve

# 2. Open browser
http://localhost:8080/projects/doc-site/www/

# 3. Look for your guide in the list
# 4. Click to read
```

### Method 2: Check JSON file directly
```bash
# Check file exists
ls -la projects/doc-site/data/docs/guides/my-guide.json

# Verify JSON format
cat projects/doc-site/data/docs/guides/my-guide.json | jq

# Check id field
grep '"id":' projects/doc-site/data/docs/guides/my-guide.json
```

### Method 3: Via Validation
```bash
make validate
# Should show: OK   projects/doc-site/data/docs/guides/my-guide.json
```

---

## 💡 Lời Khuyên khi Thêm Guides

1. **Luôn theo template** - Copy từ `getting-started.json` hoặc `build-and-deploy.json`
2. **Validate trước commit** - Chạy `make validate` TRƯỚC `git commit`
3. **Test locally** - Dùng `make serve` để xem trước khi push
4. **Dùng links** - Link tới guides liên quan trong `links` field
5. **Chuẩn format items** - Mỗi item phải có `id`, `title`, `why`, `what`, `how`
6. **Tránh fields lạ** - Không thêm fields custom mà doc-site không expect

---

## ❌ Lỗi Gặp Phải (Deployment-Quick-Guide)

**Problem**: Tạo file nhưng guide không hiện trên doc-site

**Root Cause**: 
- ❌ File dùng `"id": "deployment-quick-guide"` (thiếu `guides.` prefix)
- ❌ File dùng `"sections"` thay vì `"items"`
- ❌ Không validate trước commit

**Solution** (đã fix):
- ✅ Đổi id thành `"guides.deployment-quick-guide"`
- ✅ Chuyển `sections` thành `items` array
- ✅ Simplify content thành `items` format (mỗi item có id/title/why/what/how)
- ✅ Chạy `make validate` → OK
- ✅ Commit lên git

**Status**: ✅ FIXED - Deploy guide hiện được trên doc-site

---

## 📝 Remember (Nhớ kỹ!):

```
Bất cứ khi nào thêm guide vào doc-site:
1. id = "guides.xxxxx" (có "guides." prefix)
2. items = [{...}, {...}] (KHÔNG "sections")
3. links = [{...}] (link tới guides khác)
4. make validate (phải OK)
5. git commit & push (đừng quên!)
6. make serve + refresh (verify)
```

---

**Last Updated**: December 22, 2025  
**Fixed Issues**: deployment-quick-guide now appears in doc-site  
**Status**: ✅ Ready for future additions
