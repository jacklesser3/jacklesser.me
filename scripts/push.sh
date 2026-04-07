#!/usr/bin/env bash
# Push to GitHub. Works from Cursor or Terminal.
# Option A: Create a token at https://github.com/settings/tokens (repo scope),
#           put it in .env.github (one line, token only). File is gitignored.
# Option B: Use SSH (run from Terminal where your key is loaded).
set -e
cd "$(dirname "$0")/.."

# Use token from env or from .env.github (gitignored)
if [ -z "$GITHUB_TOKEN" ] && [ -f .env.github ]; then
  GITHUB_TOKEN=$(tr -d '\n\r' < .env.github)
fi

if [ -n "$GITHUB_TOKEN" ]; then
  git push "https://jacklesser3:${GITHUB_TOKEN}@github.com/jacklesser3/jacklesser.me.git" main
else
  REMOTE=$(git remote get-url origin 2>/dev/null || true)
  if [[ "$REMOTE" == https://* ]]; then
    echo "Switching origin to SSH..."
    git remote set-url origin git@github.com:jacklesser3/jacklesser.me.git
  fi
  git push origin main
fi
echo "Pushed to GitHub."
