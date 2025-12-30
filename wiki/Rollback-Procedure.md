# Rollback Procedure

**Version:** v2.0.0
**Category:** guides
**Tags:** `rollback`, `recovery`, `database`, `deployment`

Step-by-step procedure to rollback to a previous version when deployment fails.

---

## 1. Identify problem version

**Why:** Know which version needs to be rolled back

**What:** Determine current broken version and target rollback version

**How:**

```
git describe --tags — Shows current version; decide to rollback to vX.Y.(Z-1)
```

## 2. Stop application (if needed)

**Why:** Prevent data corruption during rollback

**What:** Stop server or disable access temporarily

**How:**

```
On hosting: make stop OR set maintenance mode
```

## 3. Checkout previous version

**Why:** Restore code to working state

**What:** Use git to revert to previous tagged version

**How:**

```
git checkout vX.Y.(Z-1) — Reverts code to previous release
```

## 4. Locate database backup

**Why:** Find backup file for rollback version

**What:** Check backups directory for version-specific backup

**How:**

```
ls -lh backups/vX.Y.(Z-1)-backup.tar.gz — Verify backup exists
```

## 5. Backup current database

**Why:** Safety net in case rollback fails

**What:** Create backup of current (broken) state

**How:**

```
make backup-database version=vX.Y.Z-broken paths='database/local data/' — Preserve current state
```

## 6. Restore database from backup

**Why:** Revert database to previous working state

**What:** Extract and restore database files

**How:**

```
tar -xzf backups/vX.Y.(Z-1)-backup.tar.gz -C ./ — Extracts database files to original locations
```

## 7. Verify file permissions

**Why:** Ensure restored files are accessible

**What:** Check and fix file/folder permissions

**How:**

```
chmod -R 755 database/local data/ — Set appropriate permissions
```

## 8. Test functionality

**Why:** Confirm rollback was successful

**What:** Run tests and manual checks

**How:**

```
make test — All tests should pass; manually test critical features
```

## 9. Verify data integrity

**Why:** Ensure database is consistent and not corrupted

**What:** Check key data points and relationships

**How:**

```
Query important tables, verify record counts, check foreign keys
```

## 10. Restart application

**Why:** Bring application back online

**What:** Start server with rolled back version

**How:**

```
make serve OR restart web server (nginx, apache, etc.)
```

## 11. Monitor for errors

**Why:** Catch any issues from rollback

**What:** Watch logs for errors or warnings

**How:**

```
tail -f /path/to/logs/*.log — Monitor for 15-30 minutes
```

## 12. Document rollback

**Why:** Track history and learn from issue

**What:** Log rollback action with reason

**How:**

```
make history-add action='rollback' msg='Rolled back from vX.Y.Z to vX.Y.(Z-1) due to <reason>' — Record in history
```

## 13. Investigate root cause

**Why:** Prevent same issue in future

**What:** Analyze what went wrong in failed version

**How:**

```
Review git diff, check logs from broken version, document findings
```

## 14. Plan fix and re-release

**Why:** Address the issue properly

**What:** Fix bug, create new version

**How:**

```
Fix code → Test → Build vX.Y.(Z+1) → Deploy with fix
```

---

## Related Links

- [Build and Deploy](#guides.build-and-deploy)
- [Database Backup Rule](#rules.core-rules)
