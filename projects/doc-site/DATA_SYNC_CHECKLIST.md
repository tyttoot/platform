# Doc-Site Data Sync Checklist

## Mục đích
Checklist này đảm bảo dữ liệu doc-site được sync đúng cách giữa source và build-output, đặc biệt là tasks data.

## Workflow

### 1. Development Workflow
Khi làm việc với doc-site trong development:

- [ ] **Chỉnh sửa data source**: Edit files trong `projects/doc-site/data/`
- [ ] **Chỉnh sửa tasks**: Edit files trong `tasks/data/`
- [ ] **Chạy sync**: `make sync-doc-site` hoặc `make serve` (tự động sync)
- [ ] **Kiểm tra**: Refresh browser, verify data hiển thị đúng

### 2. Build Workflow
Khi build project:

- [ ] **Build project**: `make build project=doc-site version=vX.Y.Z`
- [ ] **Verify tasks data**: Check `build-output/data/tasks/` có đầy đủ data
- [ ] **Verify docs data**: Check `build-output/data/docs/` có đầy đủ data
- [ ] **Test**: Test doc-site từ build-output path

### 3. Deployment Workflow
Khi deploy:

- [ ] **Build**: `make build project=doc-site version=vX.Y.Z`
- [ ] **Verify**: Check build-output có đầy đủ files
- [ ] **Deploy**: Deploy build-output folder
- [ ] **Verify production**: Test tasks và docs load đúng

## Data Sources

### Docs Data
- **Source**: `projects/doc-site/data/docs/`
- **Build Output**: `projects/doc-site/build-output/data/docs/`
- **Sync**: Automatic khi chạy `make sync-doc-site` hoặc `make serve`

### Tasks Data
- **Source**: `tasks/data/` (root level)
- **Build Output**: `projects/doc-site/build-output/data/tasks/`
- **Sync**: Automatic khi chạy `make sync-doc-site` hoặc `make build project=doc-site`

## Commands

### Manual Sync
```bash
make sync-doc-site
```
Sync docs + tasks data từ source sang build-output.

### Auto Sync
```bash
make serve
```
Tự động sync trước khi start server.

### Build với Sync
```bash
make build project=doc-site version=v2.1.0
```
Build script tự động sync tasks data vào build-output.

## Troubleshooting

### Tasks không hiển thị trong doc-site
- [ ] Check tasks data có trong `tasks/data/`?
- [ ] Check build-output có `data/tasks/`?
- [ ] Run `make sync-doc-site` để sync lại
- [ ] Check browser console có errors?

### Docs không update
- [ ] Check source file đã được edit?
- [ ] Run `make sync-doc-site`
- [ ] Hard refresh browser (Ctrl+Shift+R)

### Build-output missing data
- [ ] Run `make sync-doc-site --force` để force sync
- [ ] Check script permissions: `chmod +x scripts/sync_doc_site_data.sh`
- [ ] Verify paths trong script

## Future Improvements

### Cần phát triển thêm:
- [ ] **Auto-watch**: Watch file changes và auto-sync
- [ ] **Validation**: Validate data trước khi sync
- [ ] **Dry-run mode**: Preview changes trước khi sync
- [ ] **Selective sync**: Chỉ sync phần đã thay đổi
- [ ] **Sync status**: Show diff giữa source và build-output
- [ ] **Rollback**: Undo sync nếu có vấn đề

## Related Files
- Script: `scripts/sync_doc_site_data.sh`
- TaskLoader: `entity/task/taskLoader.js`
- Makefile: `Makefile` (sync-doc-site target)
- Build Script: `scripts/build_project.sh`

