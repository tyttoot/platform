#!/usr/bin/env bash
# Simple JSONL history logger
# Usage: bash scripts/history_log.sh [LOG_FILE] [ACTION] [MESSAGE]
set -euo pipefail

LOG_FILE=${1:-logs/history.jsonl}
ACTION=${2:-event}
shift 2 || true
MSG="$*"

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
HOST=$(hostname 2>/dev/null || echo unknown)
USR=$(whoami 2>/dev/null || echo unknown)

# Escape JSON string chars in MSG
ESC=$(printf '%s' "$MSG" | sed 's/\\/\\\\/g; s/"/\\"/g')

mkdir -p "$(dirname "$LOG_FILE")"
printf '{"ts":"%s","action":"%s","message":"%s","user":"%s","host":"%s"}\n' \
  "$TS" "$ACTION" "$ESC" "$USR" "$HOST" >> "$LOG_FILE"
