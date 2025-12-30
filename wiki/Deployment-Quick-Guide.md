# Hướng dẫn Deploy Nhanh

**Version:** v2.0.0
**Category:** guides
**Tags:** `deployment`, `guide`, `quick-start`, `commands`

Hướng dẫn chi tiết 8 bước deploy từ local machine tới hosting server với ví dụ cụ thể. Mỗi bước có lệnh, ví dụ, và kết quả mong đợi.

---

## 1. Build Project

**Why:** Tạo bản build sẵn sàng deploy

**What:** make build project=doc-site version=v2.0.0

**How:**

```
Tạo folder projects/doc-site/build-output/ với .release-manifest.json
```

## 2. Test & Validate

**Why:** Đảm bảo code chất lượng

**What:** make test && make validate

**How:**

```
Chạy tests và kiểm tra JSON schemas trước push
```

## 3. Commit Code

**Why:** Lưu changes vào git

**What:** git commit -m "[RELEASE] vX.Y.Z - Description"

**How:**

```
Format: [RELEASE] vX.Y.Z - mô tả ngắn gọn
```

## 4. Create Git Tag

**Why:** Đánh dấu version

**What:** git tag -a vX.Y.Z -m "Release notes"

**How:**

```
Tag snapshot của code tại thời điểm đó
```

## 5. Push to Git

**Why:** Đẩy code và tag lên remote

**What:** git push origin <branch> && git push origin vX.Y.Z

**How:**

```
Push code branch trước, sau đó push tag
```

## 6. Backup Database

**Why:** Bảo vệ dữ liệu trước deploy

**What:** make backup-database version=vX.Y.Z paths="database/local"

**How:**

```
Tạo tar.gz archive trong backups/ folder
```

## 7. Deploy on Hosting

**Why:** Triển khai code lên production

**What:** git pull origin <branch> && sudo systemctl restart project

**How:**

```
SSH vào hosting, pull code, restart service
```

## 8. Verify Deployment

**Why:** Xác nhận deploy thành công

**What:** curl http://domain.com && check logs

**How:**

```
Test website, check logs, verify version
```

## 9. Rollback if Needed

**Why:** Khôi phục nếu có lỗi

**What:** git checkout v<old-version> && restore backup

**How:**

```
Checkout version cũ, restore database, restart
```

## 10. Build Commands

**Why:** Tham khảo nhanh các lệnh

**What:** make build, make test, make push, make backup-database

**How:**

```
Xem phần Commands Reference để xem tất cả
```

## 11. Git Commands

**Why:** Lệnh git cần thiết

**What:** git add/commit/tag/push

**How:**

```
Sử dụng format [RELEASE] vX.Y.Z cho commit
```

## 12. Hosting Commands

**Why:** Lệnh trên hosting server

**What:** git pull, systemctl restart, check logs

**How:**

```
SSH vào hosting và chạy lệnh cần thiết
```

## 13. Troubleshooting

**Why:** Xử lý khi có sự cố

**What:** Build fail, Test fail, Git push fail, Rollback fail

**How:**

```
Kiểm tra error message, xem solutions trong guide
```

## 14. ⚠️ IMPORTANT: Doc-Site Checklist

**Why:** Tránh quên các bước khi thêm guides

**What:** Bất cứ lúc nào thêm docs phải nhớ

**How:**

```
1) id='guides.xxx' 2) Có 'items' array 3) Có 'links' field 4) make validate 5) git commit
```

---

## Related Links

- [Build & Deploy Chi Tiết](#guides.build-and-deploy)
- [Rollback Procedure](#guides.rollback-procedure)
- [Hosting Setup](#guides.hosting-setup)
