#!/usr/bin/env bash
set -euo pipefail

CONFIG_PATH=/home/kong/kong.yml
cp /home/kong/temp.yml "$CONFIG_PATH"

replace_env() {
  local name="$1"
  local value="${!name:-}"
  local escaped

  escaped=$(printf '%s' "$value" | sed -e 's/[\/&|\\]/\\&/g')
  sed -i "s|\\\$$name|$escaped|g" "$CONFIG_PATH"
}

replace_env SUPABASE_ANON_KEY
replace_env SUPABASE_SERVICE_KEY
replace_env DASHBOARD_USERNAME
replace_env DASHBOARD_PASSWORD
