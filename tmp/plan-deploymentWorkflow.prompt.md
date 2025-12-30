# Plan: Deploy Workflow & Development Process for Platform v2

## Overview
Thiết lập quy trình deploy đơn giản và hiệu quả: build output → git push → auto-pull on hosting, với rollback strategy (keep versions, backup per version), release flag tracking, document chi tiết.

---

## Phase 1: Build Output Structure

### Objective
Create `scripts/build_project.sh` to generate self-contained build output folder with all files needed for hosting.

### What it does
- Takes project name as parameter (e.g., `doc-site`)
- Creates `projects/<name>/build-output/` with complete project copy
- Copies: www/, data/, config files (exclude node_modules, .git, .env, raw data)
- Generates `.release-manifest.json` with metadata
- Output is ready for direct hosting deployment

### Files to Create
- **scripts/build_project.sh** - Main build script
- **.release-manifest.json.template** - Manifest structure template

### Manifest Structure
```json
{
  "version": "X.Y.Z",
  "timestamp": "ISO8601",
  "project": "doc-site",
  "branch": "staging",
  "buildOutputPath": "projects/doc-site/build-output/",
  "git": {
    "commit": "abc123...",
    "tag": "vX.Y.Z",
    "author": "Norman"
  },
  "changes": {
    "filesAdded": 3,
    "filesModified": 5,
    "filesDeleted": 0,
    "description": "Release description"
  },
  "database": {
    "backupLocation": "backups/vX.Y.Z-backup.tar.gz",
    "backupTimestamp": "ISO8601",
    "note": "Database snapshot before release"
  },
  "rollbackInfo": {
    "previousVersion": "vX.Y-1.Z",
    "rollbackCommand": "git checkout vX.Y-1.Z"
  },
  "releaseNotes": "Production release notes"
}
```

### Output
- ✅ `projects/doc-site/build-output/` - Ready for hosting
- ✅ `projects/doc-site/build-output/.release-manifest.json` - Metadata
- ✅ Local copy kept for reference (delete after git push)

---

## Phase 2: Release Versioning & Tagging

### Objective
Implement git-based versioning with automatic tagging and metadata tracking.

### What it does
- Each release gets semantic version tag (v2.1.0, v2.1.1)
- Git tag contains code snapshot + release notes
- Manifest tracks which version rolled back to which previous version
- Support rollback via `git checkout vX.Y-1.Z`

### Files to Create/Modify
- **scripts/push_to_git.sh** - Git push + tagging automation
- **Update Makefile** - Add `push` target

### Git Tag Strategy
```bash
git tag -a v2.0.0 -m "Release: vX.Y.Z - Description"
git push origin staging v2.0.0
```

### Manifest Rollback Chain
```
v2.1.0 → rollback to v2.0.9 → rollback to v2.0.8
```

### Output
- ✅ Git tag created with version + release notes
- ✅ Code + tag pushed to staging/production branch
- ✅ Manifest stored in build-output/.release-manifest.json
- ✅ History logged: action="release", msg="vX.Y.Z released"

---

## Phase 3: Database Backup & Management

### Objective
Create script to backup database files/folders per version, enable rollback recovery.

### What it does
- Creates per-version backup: `backups/vX.Y.Z-backup.tar.gz`
- Backs up specified paths (data files/folders only)
- Stores backup metadata (timestamp, paths, size)
- Enables database restore during rollback

### Important Notes
- **Data NOT deployed** - Only code + migrations deployed
- **Backup created on hosting** during deploy process
- **Migrations included** in deployment for data schema updates
- **Rollback includes** database restore from backup

### Files to Create
- **scripts/backup_database.sh** - Backup automation script

### Backup Structure
```
backups/
├── vX.Y.Z-backup/
│   ├── database.backup
│   ├── backup-metadata.json
│   └── .tar.gz
```

### Backup Metadata
```json
{
  "version": "vX.Y.Z",
  "timestamp": "ISO8601",
  "paths": ["database/local/", "data/"],
  "totalSize": "5.2MB",
  "checksum": "sha256hash..."
}
```

### Output
- ✅ `backups/vX.Y.Z-backup.tar.gz` created
- ✅ Metadata stored in backup folder
- ✅ Backup location referenced in manifest

---

## Phase 4: Platform Rules Updates

### Objective
Add 4 new rules to `document/platform-rules.md` defining deployment process.

### Rules to Add

#### Rule 20251222007: Build Output Structure
- Build project into self-contained `build-output/` folder
- Include all files needed for hosting (code, assets, config, migrations)
- Exclude: source maps, node_modules, .git, raw data files
- Generate `.release-manifest.json` with metadata
- Keep locally for reference, delete after push to git

#### Rule 20251222008: Version Tagging & Rollback Strategy
- Each release gets semantic version tag (vX.Y.Z)
- Keep tag history on git for rollback reference
- Rollback strategy: `git checkout vX-1.Y.Z` + restore database from backup
- Database backups stored per-version: `backups/vX.Y.Z-backup/`
- **Rollback testing required** after each rollback

#### Rule 20251222009: Git Push & Tagging Requirements
- Before push: Run `make test` + `make validate`
- Commit message format: `[RELEASE] vX.Y.Z - Description`
- Create annotated git tag with release notes
- Push both code branch and tags
- Log to history: action="release", msg="vX.Y.Z released"

#### Rule 20251222010: Database Backup & Migration
- Database files NOT included in deployment
- Backup per-version: `backups/vX.Y.Z-backup.tar.gz` (created on hosting)
- Migrations/config included in deployment for setup
- Rollback includes database restore from backup
- **Data integrity testing required** after rollback

---

## Phase 5: Makefile Updates

### New Targets

```makefile
# Build
build:
	@bash scripts/build_project.sh $(project)

# Git push with tagging
push:
	@bash scripts/push_to_git.sh $(project) $(version) $(branch) $(msg)

# Database backup
backup-database:
	@bash scripts/backup_database.sh $(version) $(paths)
```

### Usage Examples
```bash
make build project=doc-site
make push project=doc-site version=v2.0.0 branch=staging msg="Deploy with docs"
make backup-database version=v2.0.0 paths="database/local data/"
```

---

## Phase 6: Documentation in Doc-Site

### Files to Create in `projects/doc-site/data/docs/`

#### 1. guides/build-and-deploy.json
- Step 1: Run `make build project=<name>`
- Step 2: Verify `build-output/` created with all files
- Step 3: Run `make test` to validate code
- Step 4: Run `make validate` to check docs/config
- Step 5: Run `make push project=<name> version=vX.Y.Z`
- Step 6: On hosting: `git pull` + run migrations
- Links to rollback guide

#### 2. guides/rollback-procedure.json
- Identify version needing rollback
- On hosting: `git checkout vX-1.Y.Z`
- Restore database: `tar -xzf backups/vX-1.Y.Z-backup.tar.gz`
- Run tests to verify functionality
- Document rollback action in history

#### 3. guides/hosting-setup.json
- Git pull mechanism setup (webhook or cron)
- Folder structure on hosting (code, backups, migrations, logs)
- Auto-pull script setup for continuous deployment
- Logging setup for all pull/rollback actions
- Credentials management (provided by deployment team)

#### 4. specs/release-manifest-schema.json
- JSON schema for `.release-manifest.json`
- Field descriptions with examples
- Database backup reference format
- Rollback command reference format
- Validation rules

---

## Phase 7: Test with Doc-Site

### Test Procedure

1. **Build**
   ```bash
   bash scripts/build_project.sh doc-site
   ```
   - Verify: `projects/doc-site/build-output/` created
   - Check: All www/ + data/ files present
   - Confirm: `.release-manifest.json` generated

2. **Validate Manifest**
   - Verify version, timestamp, project fields
   - Check buildOutputPath correct
   - Validate git metadata
   - Ensure rollback info populated

3. **Test**
   ```bash
   make test
   ```
   - All tests must pass before push

4. **Push**
   ```bash
   make push project=doc-site version=v2.0.0 branch=staging msg="Initial deployment structure"
   ```
   - Verify: Git tag `v2.0.0` created
   - Confirm: Code pushed to staging
   - Check: History logged

5. **Verify Output**
   - Check git tags: `git tag -l v2.0.0`
   - Verify manifest in build-output/
   - Review history log

6. **Document Results**
   - Record timestamps for each step
   - Note any issues encountered
   - Document build-output folder structure
   - Save test results to history

---

## Important Notes

### Deployment Flow
1. **Local**: Build → Test → Push to git
2. **Hosting**: Git pull → Run migrations → Serve code
3. **Rollback**: Git checkout version → Restore database → Test

### Build Output Cleanup
- Keep locally for reference
- Delete `build-output/` after successful git push
- Version is already saved in git tag

### Database Handling
- Data files NOT deployed (stay on hosting)
- Backups created on hosting per-release
- Migrations in deployment for schema updates
- Rollback includes database restore

### Testing Requirements
- ✅ Before push: `make test` + `make validate`
- ✅ After rollback: Test functionality to verify data/code consistency

### Logging & Tracking
- All actions logged to `logs/history.jsonl`
- Format: action="release|deploy|rollback", msg="description"
- Includes timestamp, user, host information
- Enable troubleshooting and auditing

---

## Further Considerations (To Discuss)

1. **Hosting Credentials**
   - Git SSH key / token setup (to be provided)
   - Environment variables for hosting deployment
   - Secrets management strategy

2. **CI/CD Pipeline** (Optional, not required)
   - GitHub Actions for automated testing
   - Auto-deploy on tag creation
   - Advanced but optional

3. **Monitoring** (To be implemented later)
   - Post-deploy sanity tests
   - Error logging on hosting
   - Backup verification

---

## Implementation Order

1. ✅ Phase 1: `scripts/build_project.sh` + manifest template
2. ✅ Phase 2: `scripts/push_to_git.sh` + git tagging
3. ✅ Phase 3: `scripts/backup_database.sh` + backup strategy
4. ✅ Phase 4: Update `document/platform-rules.md` with 4 new rules
5. ✅ Phase 5: Update `Makefile` with build/push/backup targets
6. ✅ Phase 6: Create 4 documentation files in doc-site
7. ✅ Phase 7: Test entire workflow with doc-site project

---

## Success Criteria

- [ ] `build-output/` folder structure correct and complete
- [ ] `.release-manifest.json` generated with all metadata
- [ ] Git tag `v2.0.0` created for doc-site
- [ ] History logged for build + push actions
- [ ] 4 documentation files created in doc-site
- [ ] 4 new platform rules added
- [ ] Makefile targets working (build/push/backup)
- [ ] All tests passing before push
- [ ] Manifest chain shows rollback path
- [ ] Backup script creates versioned backups

---

## Next Steps After Implementation

1. Share hosting setup requirements
2. Setup git credentials on hosting
3. Setup auto-pull mechanism on hosting
4. Test full deployment cycle: build → push → pull → verify
5. Document any hosting-specific configurations
6. Plan for biggerdot deployment (after doc-site verified)
