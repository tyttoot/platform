# Build and Deploy Workflow

**Version:** v2.0.0
**Category:** guides
**Tags:** `deployment`, `build`, `release`, `git`

Complete workflow to build, test, and deploy projects from local to hosting.

---

## 1. Prepare for build

**Why:** Ensure code is ready for release

**What:** Run tests and validation before build

**How:**

```
make test && make validate — Both must pass before proceeding
```

## 2. Build project

**Why:** Create self-contained deployment artifact

**What:** Generate build-output folder with all necessary files

**How:**

```
make build project=<name> version=<X.Y.Z> — Creates projects/<name>/build-output/ with .release-manifest.json
```

## 3. Verify build output

**Why:** Ensure build completed correctly

**What:** Check folder structure and manifest

**How:**

```
ls -la projects/<name>/build-output/ — Verify www/, data/, and .release-manifest.json exist
```

## 4. Review manifest

**Why:** Validate release metadata

**What:** Check version, git info, changes count, rollback info

**How:**

```
cat projects/<name>/build-output/.release-manifest.json — Review all fields
```

## 5. Push to git with tagging

**Why:** Version control and enable rollback capability

**What:** Commit code, create git tag, push to remote

**How:**

```
make push project=<name> version=vX.Y.Z branch=<main|staging> msg='Release description' — Creates tag and pushes
```

## 6. Verify git tag

**Why:** Confirm version was tagged correctly

**What:** Check git tag exists

**How:**

```
git tag -l vX.Y.Z — Should show the tag you just created
```

## 7. Pull on hosting

**Why:** Deploy code to production/staging server

**What:** SSH to hosting, pull latest code from git

**How:**

```
On hosting: git pull origin <branch> — Downloads new version
```

## 8. Run migrations (if any)

**Why:** Update database schema or config

**What:** Execute migration scripts included in deployment

**How:**

```
On hosting: bash migrations/migrate_vX.Y.Z.sh (if exists)
```

## 9. Create database backup

**Why:** Enable rollback to previous data state

**What:** Backup database files per-version

**How:**

```
On hosting: make backup-database version=vX.Y.Z paths='database/local data/' — Creates backups/vX.Y.Z-backup.tar.gz
```

## 10. Verify deployment

**Why:** Ensure application works correctly

**What:** Test critical functionality

**How:**

```
Open application URL, test key features, check logs for errors
```

## 11. Log deployment

**Why:** Track deployment history

**What:** Record deployment action in history

**How:**

```
make history-add action='deploy' msg='vX.Y.Z deployed to <server>' — Logs timestamp and details
```

## 12. Cleanup local build

**Why:** Free disk space (code already in git)

**What:** Delete build-output folder after successful push

**How:**

```
rm -rf projects/<name>/build-output/ — Optional, can keep for reference
```

---

## Related Links

- [Rollback Procedure](#guides.rollback-procedure)
- [Hosting Setup](#guides.hosting-setup)
- [Release Manifest Schema](#specs.release-manifest-schema)
