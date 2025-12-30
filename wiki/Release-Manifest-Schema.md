# Release Manifest Schema

**Version:** v2.0.0
**Category:** specs
**Tags:** `schema`, `manifest`, `deployment`, `metadata`

JSON schema specification for .release-manifest.json file generated during build process.

---

## 1. Schema overview

**Why:** Understand manifest purpose and structure

**What:** Release manifest tracks metadata for each build

**How:**

```
File: .release-manifest.json in build-output folder — Contains version, git info, changes, backup refs, rollback command
```

## 2. Field: version

**Why:** Identify release version

**What:** Semantic version string

**How:**

```
Format: 'vX.Y.Z' or 'X.Y.Z' — Example: 'v2.0.0' or '2.1.3'
```

## 3. Field: timestamp

**Why:** Record when build was created

**What:** ISO 8601 timestamp in UTC

**How:**

```
Format: 'YYYY-MM-DDTHH:MM:SSZ' — Example: '2025-12-22T14:30:00Z'
```

## 4. Field: project

**Why:** Identify which project was built

**What:** Project name string

**How:**

```
Example: 'doc-site', 'biggerdot', 'logshub'
```

## 5. Field: branch

**Why:** Track which git branch was built

**What:** Git branch name

**How:**

```
Example: 'main', 'staging', 'dev-003-deployment-workflow'
```

## 6. Field: buildOutputPath

**Why:** Reference where build output is located

**What:** Relative path to build output folder

**How:**

```
Format: 'projects/<name>/build-output/' — Example: 'projects/doc-site/build-output/'
```

## 7. Object: git

**Why:** Track git metadata for traceability

**What:** Object with commit hash, tag, author

**How:**

```
Fields: commit (string, short hash), tag (string, git tag), author (string, committer name)
```

## 8. git.commit

**Why:** Reference exact code state

**What:** Git commit hash (short or full)

**How:**

```
Example: 'fa5c97f' (short) or 'fa5c97f3a2b1c...' (full)
```

## 9. git.tag

**Why:** Version tag for rollback

**What:** Git tag string

**How:**

```
Format: 'vX.Y.Z' — Example: 'v2.0.0'
```

## 10. git.author

**Why:** Know who created the release

**What:** Name of person/system that built release

**How:**

```
Example: 'Norman', 'CI Bot', 'GitHub Actions'
```

## 11. Object: changes

**Why:** Track what changed in this release

**What:** Object with file change counts and description

**How:**

```
Fields: filesAdded (number), filesModified (number), filesDeleted (number), totalChanged (number), description (string)
```

## 12. changes.filesAdded

**Why:** Count new files

**What:** Number of files added since last release

**How:**

```
Example: 5 (integer)
```

## 13. changes.filesModified

**Why:** Count changed files

**What:** Number of files modified since last release

**How:**

```
Example: 12 (integer)
```

## 14. changes.filesDeleted

**Why:** Count removed files

**What:** Number of files deleted since last release

**How:**

```
Example: 2 (integer)
```

## 15. changes.totalChanged

**Why:** Total change summary

**What:** Total files that changed (added + modified + deleted)

**How:**

```
Example: 19 (integer)
```

## 16. changes.description

**Why:** Describe what changed

**What:** Human-readable description of changes

**How:**

```
Example: 'Added deployment infrastructure, updated rules, created build scripts'
```

## 17. Object: database

**Why:** Reference database backup information

**What:** Object with backup location and timestamp

**How:**

```
Fields: backupLocation (string), backupTimestamp (string), note (string)
```

## 18. database.backupLocation

**Why:** Know where database backup is stored

**What:** Path to backup file (created on hosting)

**How:**

```
Format: 'backups/vX.Y.Z-backup.tar.gz' — Example: 'backups/v2.0.0-backup.tar.gz'
```

## 19. database.backupTimestamp

**Why:** Know when backup was created

**What:** ISO 8601 timestamp

**How:**

```
Format: 'YYYY-MM-DDTHH:MM:SSZ' — Example: '2025-12-22T14:28:00Z'
```

## 20. database.note

**Why:** Additional backup information

**What:** Freeform note about backup

**How:**

```
Example: 'Database snapshot created on hosting before release'
```

## 21. Object: rollbackInfo

**Why:** Provide rollback instructions

**What:** Object with rollback command and previous version

**How:**

```
Fields: rollbackCommand (string), previousVersion (string), note (string, optional)
```

## 22. rollbackInfo.rollbackCommand

**Why:** Quick rollback reference

**What:** Shell command to rollback to previous version

**How:**

```
Example: 'git checkout v2.0.0 && restore_database_backup_v2.0.0'
```

## 23. rollbackInfo.previousVersion

**Why:** Know which version to rollback to

**What:** Previous release version tag

**How:**

```
Format: 'vX.Y.Z' — Example: 'v1.9.9'
```

## 24. Field: releaseNotes

**Why:** Human-readable release summary

**What:** Description of release highlights

**How:**

```
Example: 'Production release v2.0.0 with deployment workflow, 4 new rules, testing framework'
```

## 25. Complete example manifest

**Why:** See all fields together

**What:** Full JSON example

**How:**

```
{"version":"v2.0.0","timestamp":"2025-12-22T14:30:00Z","project":"doc-site","branch":"main","buildOutputPath":"projects/doc-site/build-output/","git":{"commit":"fa5c97f","tag":"v2.0.0","author":"Norman"},"changes":{"filesAdded":8,"filesModified":5,"filesDeleted":0,"totalChanged":13,"description":"Deployment infrastructure"},"database":{"backupLocation":"backups/v2.0.0-backup.tar.gz","backupTimestamp":"2025-12-22T14:28:00Z","note":"Snapshot on hosting"},"rollbackInfo":{"rollbackCommand":"git checkout v1.9.9","previousVersion":"v1.9.9"},"releaseNotes":"Production release with deployment workflow"}
```

---

## Related Links

- [Build and Deploy Guide](#guides.build-and-deploy)
