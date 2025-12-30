# Quick Start: Deployment Workflow Commands

## Build Commands

```bash
# Build a project into self-contained build output
make build project=doc-site version=v2.0.0

# Build with custom version
make build project=biggerdot version=v1.5.0
```

## Test & Validate Commands

```bash
# Run all tests
make test

# Run unit tests only
make test-unit

# Run integration tests only
make test-integration

# Validate documentation
make validate
```

## Release Commands

```bash
# Push release to git with version tag
make push project=doc-site version=v2.0.0 branch=staging msg="Deploy documentation system"

# Push with custom branch
make push project=doc-site version=v2.0.0 branch=production msg="Production release"
```

## Backup Commands

```bash
# Backup database for a version
make backup-database version=v2.0.0 paths="database/local data/"

# Backup multiple paths
make backup-database version=v2.0.0 paths="database/local database/cache data/"
```

## History Commands

```bash
# Add custom history entry
make history-add action="release" msg="v2.0.0 released - new features"

# Show recent history
make history-show
```

## Complete Workflow Example

```bash
# 1. Build the project
make build project=doc-site version=v2.0.0

# 2. Verify build output
ls -la projects/doc-site/build-output/
cat projects/doc-site/build-output/.release-manifest.json

# 3. Run tests to ensure quality
make test
make validate

# 4. Commit changes
git add -A
git commit -m "[RELEASE] v2.0.0 - Deploy documentation system"

# 5. Push release to git with version tag
make push project=doc-site version=v2.0.0 branch=staging msg="Production release of docs"

# 6. Verify the tag was created
git tag -l v2.0.0
git show v2.0.0

# 7. Create database backup (on hosting server)
make backup-database version=v2.0.0 paths="database/local"

# 8. Deploy on hosting
# SSH to hosting server and run:
# git pull origin staging
# make test
# sudo systemctl restart project
```

## Key Files & Locations

**Scripts:**
- `scripts/build_project.sh` - Build automation
- `scripts/push_to_git.sh` - Git push automation  
- `scripts/backup_database.sh` - Database backup

**Configuration:**
- `Makefile` - Build targets
- `document/platform-rules.md` - Platform rules

**Documentation:**
- `projects/doc-site/data/docs/guides/build-and-deploy.json` - Full guide
- `projects/doc-site/data/docs/guides/rollback-procedure.json` - Rollback guide
- `projects/doc-site/data/docs/guides/hosting-setup.json` - Setup guide
- `projects/doc-site/data/docs/specs/release-manifest-schema.json` - Tech spec

**Build Output:**
- `projects/<project>/build-output/` - Release artifacts
- `projects/<project>/build-output/.release-manifest.json` - Metadata

**Backups:**
- `backups/v<version>-backup.tar.gz` - Database backups

## Rollback Process

If you need to rollback to a previous version:

```bash
# 1. Identify the version to rollback to
git tag -l | tail -10

# 2. Checkout previous version
git checkout v1.9.0

# 3. Restore database from backup (on hosting)
tar -xzf backups/v1.9.0-backup.tar.gz -C /restore/path/

# 4. Restart service
sudo systemctl restart project-name

# 5. Verify rollback worked
make test

# 6. Log the rollback action
make history-add action="rollback" msg="Rolled back from v2.0.0 to v1.9.0 due to [reason]"
```

## Success Criteria Checklist

Before pushing a release, verify:
- [ ] Code changes completed
- [ ] Build successful: `make build project=<name>`
- [ ] All tests pass: `make test`
- [ ] Documentation valid: `make validate`
- [ ] Build output created correctly
- [ ] `.release-manifest.json` generated
- [ ] Git commit message formatted: `[RELEASE] vX.Y.Z - Description`
- [ ] Git tag created: `git tag -a vX.Y.Z -m "..."`
- [ ] Ready to push: `make push project=<name> version=<X.Y.Z> ...`

## Troubleshooting

**Q: Build fails**
A: Check if project exists at `projects/<name>/` with required folders (www/, data/, document/)

**Q: Tests fail**
A: Run `make test-unit` and `make test-integration` separately to identify which tests fail

**Q: Git push fails**
A: Verify git credentials and remote branch exists: `git remote -v` and `git branch -a`

**Q: Can't rollback**
A: Check backup file exists: `ls -la backups/v<version>-backup.tar.gz`

**Q: Hosting deploy fails**
A: SSH to hosting and verify git can pull: `git pull origin <branch>`

## Documentation Links

- [Complete Build & Deploy Guide](../projects/doc-site/data/docs/guides/build-and-deploy.json)
- [Rollback Procedures](../projects/doc-site/data/docs/guides/rollback-procedure.json)
- [Hosting Setup](../projects/doc-site/data/docs/guides/hosting-setup.json)
- [Platform Rules](../document/platform-rules.md)

---

**Version**: v2.0.0  
**Release Date**: December 22, 2025  
**Status**: ✅ Production Ready
