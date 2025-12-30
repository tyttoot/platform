# Hosting Setup for Deployment

**Version:** v2.0.0
**Category:** guides
**Tags:** `hosting`, `server`, `deployment`, `automation`

Setup hosting environment to receive and deploy code from git repository.

---

## 1. Prepare hosting environment

**Why:** Set up basic infrastructure

**What:** Install required software (git, PHP, Node, etc.)

**How:**

```
On hosting: apt-get install git php8.2-cli nodejs (Ubuntu) OR yum install git php nodejs (CentOS)
```

## 2. Create directory structure

**Why:** Organize code, backups, logs

**What:** Set up folder layout

**How:**

```
mkdir -p /var/www/platform/{code,backups,logs,migrations} — Create necessary folders
```

## 3. Setup git credentials

**Why:** Allow hosting to pull from repository

**What:** Configure SSH key or access token

**How:**

```
ssh-keygen -t rsa -b 4096 -C 'hosting@server.com' → Add public key to GitHub/GitLab deploy keys
```

## 4. Clone repository

**Why:** Get initial codebase

**What:** Clone git repository to hosting

**How:**

```
cd /var/www/platform/code && git clone git@github.com:user/platform.git . — Clone to current directory
```

## 5. Checkout target branch

**Why:** Deploy from correct branch (staging or production)

**What:** Switch to deployment branch

**How:**

```
git checkout staging — Or git checkout main for production
```

## 6. Setup auto-pull mechanism (webhook)

**Why:** Automated deployment on git push

**What:** Create webhook endpoint to receive push notifications

**How:**

```
Create webhook.php that runs: git pull origin <branch> when triggered; configure webhook URL in GitHub/GitLab settings
```

## 7. Setup auto-pull mechanism (cron job)

**Why:** Alternative to webhook - periodic pull

**What:** Cron job to pull changes every N minutes

**How:**

```
crontab -e → Add: '*/5 * * * * cd /var/www/platform/code && git pull origin staging >> /var/www/platform/logs/git-pull.log 2>&1' — Pulls every 5 minutes
```

## 8. Setup deployment logging

**Why:** Track all pull/deploy actions

**What:** Log git pull results and timestamps

**How:**

```
Redirect output to logs/git-pull.log (shown in HS-07); rotate logs with logrotate
```

## 9. Configure file permissions

**Why:** Ensure web server can read files

**What:** Set ownership and permissions

**How:**

```
chown -R www-data:www-data /var/www/platform/code && chmod -R 755 /var/www/platform/code — Adjust user/group as needed
```

## 10. Setup web server (Apache/Nginx)

**Why:** Serve the application

**What:** Configure virtual host to point to application

**How:**

```
Create /etc/nginx/sites-available/platform.conf with root pointing to /var/www/platform/code/projects/doc-site/www/
```

## 11. Setup environment variables

**Why:** Store credentials and config

**What:** Create .env file (not in git)

**How:**

```
Create .env in /var/www/platform/code/ with: DB_HOST, DB_USER, API_KEYS, etc. — Ensure .env is in .gitignore
```

## 12. Test manual pull

**Why:** Verify git pull works

**What:** Manually pull latest code

**How:**

```
cd /var/www/platform/code && git pull origin staging — Should download latest code without errors
```

## 13. Test webhook/cron

**Why:** Verify auto-pull mechanism works

**What:** Trigger pull and check logs

**How:**

```
Push dummy commit to repo → Check logs/git-pull.log for pull activity within 5 minutes
```

## 14. Document hosting config

**Why:** Reference for troubleshooting and team

**What:** Record server details, credentials locations, cron jobs

**How:**

```
Create hosting-config.md with: server IP, SSH access, git remote, cron schedule, log locations
```

---

## Related Links

- [Build and Deploy](#guides.build-and-deploy)
