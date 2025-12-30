# TYTTOOT Platform - Root Makefile (minimal automation + history)
# Usage:
#   make help         # list commands
#   make serve        # start PHP dev server and open doc-site
#   make stop         # stop server
#   make status       # show server status
#   make open-doc     # open doc-site URL

.PHONY: help serve stop status open-doc doc-serve history-add history-show validate new-doc new-entity new-project version task-new task-list task-show task-move task-done task-reopen task-validate task-audit test test-unit test-integration test-watch test-browser build push backup-database

# Config
ROOT_DIR := ./
PHP_PORT ?= 8080
SERVE_DIR := $(ROOT_DIR)
DOC_URL := http://localhost:$(PHP_PORT)/projects/doc-site/www/index.html
LOG_FILE := /tmp/tyt-php-server.log
HISTORY_FILE := logs/history.jsonl

help:
	@echo "Available commands:"
	@echo "  make serve     - Start PHP dev server on port $(PHP_PORT) and open doc site"
	@echo "  make stop      - Stop PHP dev server"
	@echo "  make status    - Show PHP server status"
	@echo "  make open-doc  - Open doc site in browser"
	@echo "  make history-add action=.. msg=..  - Append a history entry"
	@echo "  make history-show                  - Show latest history entries"
	@echo "  make validate   - Validate doc JSON files"
	@echo "  make new-doc category=.. slug=..   - Scaffold a doc JSON"
	@echo "  make new-entity name=.. category=.. [description=..]  - Scaffold entity module"
	@echo "  make new-project name=..           - Scaffold new project"
	@echo "  make version tag=.. msg=..         - Create git tag and update HISTORY"
	@echo ""
	@echo "Task Management:"
	@echo "  make task-new id=.. title=.. [priority=..] [assignee=..]  - Create new task"
	@echo "  make task-list [status=..]         - List tasks (all or by status)"
	@echo "  make task-show id=..               - Show task details"
	@echo "  make task-move id=.. to=..         - Move task to new status"
	@echo "  make task-done id=..               - Mark task as done"
	@echo "  make task-reopen id=..             - Reopen completed task"
	@echo "  make task-validate                 - Validate all task JSON files"
	@echo "  make task-audit                    - Audit DONE tasks for completion"
	@echo ""
	@echo "Testing:"
	@echo "  make test                          - Run all tests (unit + integration)"
	@echo "  make test-unit                     - Run unit tests only"
	@echo "  make test-integration              - Run integration tests only"
	@echo "  make test-watch                    - Watch mode (re-run on changes)"
	@echo "  make test-browser                  - Open test runner in browser"
	@echo ""
	@echo "Data Sync:"
	@echo "  make sync-doc-site                 - Sync doc-site data (docs + tasks) to build-output"
	@echo ""
	@echo "Deployment:"
	@echo "  make build project=<name> [version=..]        - Build project to build-output/"
	@echo "  make push project=<name> version=.. [branch=.. msg=..]  - Push release to git with tagging"
	@echo "  make backup-database version=.. paths=..  - Backup database files for version"

# Alias
doc-serve: serve

update-task-index:
	@bash scripts/update_task_index.sh
	@bash scripts/history_log.sh $(HISTORY_FILE) "tasks:update-index" "updated task index files"

sync-doc-site: update-task-index
	@bash scripts/sync_doc_site_data.sh --force
	@bash scripts/history_log.sh $(HISTORY_FILE) "sync:doc-site" "synced doc-site data to build-output"

serve: sync-doc-site
	@echo "🚀 Starting PHP server on http://localhost:$(PHP_PORT) ..."
	@php -S localhost:$(PHP_PORT) -t $(SERVE_DIR) >$(LOG_FILE) 2>&1 &
	@sleep 0.3
	@echo "📄 Logs: $(LOG_FILE)"
	@echo "🌐 Opening $(DOC_URL)"
	@(( command -v open >/dev/null 2>&1 && open "$(DOC_URL)" ) || ( command -v xdg-open >/dev/null 2>&1 && xdg-open "$(DOC_URL)" ) || echo "⚠️  Could not auto-open browser. Visit: $(DOC_URL)")
	@bash scripts/history_log.sh $(HISTORY_FILE) "serve:start" "PHP server on port $(PHP_PORT), dir=$(SERVE_DIR)"

stop:
	@echo "🛑 Stopping PHP server(s) on port $(PHP_PORT)..."
	@pids="$$(lsof -t -iTCP:$(PHP_PORT) -sTCP:LISTEN || true)"; \
	if [ -n "$$pids" ]; then \
		echo "Killing: $$pids"; \
		kill $$pids; \
		sleep 0.2; \
		if lsof -iTCP:$(PHP_PORT) -sTCP:LISTEN >/dev/null 2>&1; then \
			echo "⚠️  Some processes still listening on port $(PHP_PORT)."; \
		else \
			echo "✅ PHP server stopped."; \
			[ -f $(LOG_FILE) ] && rm -f $(LOG_FILE) && echo "🧹 Removed $(LOG_FILE)"; \
		fi; \
	else \
		echo "No PHP server running on port $(PHP_PORT)."; \
	fi
	@bash scripts/history_log.sh $(HISTORY_FILE) "serve:stop" "attempted; killed any listeners on $(PHP_PORT)"

status:
	@echo "🔎 Checking server on port $(PHP_PORT) ..."
	@lsof -nP -iTCP:$(PHP_PORT) -sTCP:LISTEN || echo "No server listening on $(PHP_PORT)."
	@bash scripts/history_log.sh $(HISTORY_FILE) "serve:status" "queried status on port $(PHP_PORT)"

open-doc:
	@(( command -v open >/dev/null 2>&1 && open "$(DOC_URL)" ) || ( command -v xdg-open >/dev/null 2>&1 && xdg-open "$(DOC_URL)" ) || echo "Open: $(DOC_URL)")
	@bash scripts/history_log.sh $(HISTORY_FILE) "doc:open" "$(DOC_URL)"

validate:
	@node scripts/validate_docs.js
	@bash scripts/history_log.sh $(HISTORY_FILE) "docs:validate" "validated doc JSON files"

new-doc:
	@bash scripts/new_doc.sh $(category) $(slug)
	@bash scripts/history_log.sh $(HISTORY_FILE) "docs:new" "$(category)/$(slug)"

# Manual history entry: e.g., make history-add action="init:phase1" msg="Created skeleton"
history-add:
	@mkdir -p logs
	@bash scripts/history_log.sh $(HISTORY_FILE) "$(action)" "$(msg)"
	@echo "📝 Logged: $(action) - $(msg)"

# Show last 30 entries (simple)
history-show:
	@echo "📜 Last history entries (tail):"
	@tail -n 30 $(HISTORY_FILE) 2>/dev/null || echo "No history yet (file: $(HISTORY_FILE))"

new-entity:
	@bash scripts/new_entity.sh $(name) $(category) "$(description)"
	@bash scripts/history_log.sh $(HISTORY_FILE) "entity:new" "$(category)/$(name)"

new-project:
	@bash scripts/new_project.sh $(name)
	@bash scripts/history_log.sh $(HISTORY_FILE) "project:new" "$(name)"

version:
	@bash scripts/doc_version.sh $(tag) "$(msg)"
	@bash scripts/history_log.sh $(HISTORY_FILE) "version:tag" "$(tag) - $(msg)"

# Task Management
task-new:
	@bash scripts/task_manager.sh new $(id) "$(title)" $(priority) "$(assignee)"
	@bash scripts/update_task_index.sh
	@bash scripts/history_log.sh $(HISTORY_FILE) "task:new" "$(id) - $(title)"

task-list:
	@bash scripts/task_manager.sh list $(status)

task-show:
	@bash scripts/task_manager.sh show $(id)

task-move:
	@bash scripts/task_manager.sh move $(id) $(to)
	@bash scripts/update_task_index.sh
	@bash scripts/history_log.sh $(HISTORY_FILE) "task:move" "$(id) → $(to)"

task-done:
	@bash scripts/task_manager.sh done $(id)
	@bash scripts/update_task_index.sh
	@bash scripts/history_log.sh $(HISTORY_FILE) "task:done" "$(id)"

task-reopen:
	@bash scripts/task_manager.sh reopen $(id)
	@bash scripts/update_task_index.sh
	@bash scripts/history_log.sh $(HISTORY_FILE) "task:reopen" "$(id)"

task-validate:
	@bash scripts/task_manager.sh validate
	@bash scripts/history_log.sh $(HISTORY_FILE) "task:validate" "validated all tasks"

task-audit:
	@bash scripts/audit_done_tasks.sh

# Testing
test:
	@echo "🧪 Running all tests..."
	@node scripts/run_tests.js --dir projects/doc-site/tests
	@bash scripts/history_log.sh $(HISTORY_FILE) "test:all" "ran all tests"

test-unit:
	@echo "🧪 Running unit tests..."
	@node scripts/run_tests.js --dir projects/doc-site/tests/unit
	@bash scripts/history_log.sh $(HISTORY_FILE) "test:unit" "ran unit tests"

test-integration:
	@echo "🧪 Running integration tests..."
	@node scripts/run_tests.js --dir projects/doc-site/tests/integration
	@bash scripts/history_log.sh $(HISTORY_FILE) "test:integration" "ran integration tests"

test-watch:
	@echo "🔄 Watch mode: re-running tests on file changes..."
	@echo "Press Ctrl+C to stop"
	@bash -c 'while true; do \
		clear; \
		make test; \
		echo ""; \
		echo "Waiting for changes... (Ctrl+C to stop)"; \
		sleep 2; \
	done'

# Deployment targets

build:
	@bash scripts/build_project.sh $(project) $(version)

push:
	@bash scripts/push_to_git.sh $(project) $(version) $(branch) $(msg)

backup-database:
	@bash scripts/backup_database.sh $(version) $(paths)
test-browser:
	@echo "🌐 Opening test runner in browser..."
	@(( command -v open >/dev/null 2>&1 && open "http://localhost:$(PHP_PORT)/projects/doc-site/tests/index.html" ) || ( command -v xdg-open >/dev/null 2>&1 && xdg-open "http://localhost:$(PHP_PORT)/projects/doc-site/tests/index.html" ) || echo "Open: http://localhost:$(PHP_PORT)/projects/doc-site/tests/index.html")
	@bash scripts/history_log.sh $(HISTORY_FILE) "test:browser" "opened test runner"
