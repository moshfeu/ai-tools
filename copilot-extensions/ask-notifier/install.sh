#!/usr/bin/env bash
set -e

DEST="$HOME/.copilot/extensions/ask-notifier"

echo "📦 Installing ask-notifier..."
mkdir -p "$DEST"
cp "$(dirname "$0")/extension.mjs" "$DEST/extension.mjs"

echo "✅ Installed to $DEST"
echo ""
echo "Restart your Copilot CLI session (/restart) to activate."
echo "terminal-notifier will be auto-installed on first use (requires Homebrew)."
