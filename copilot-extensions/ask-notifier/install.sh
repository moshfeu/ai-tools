#!/usr/bin/env bash
set -e

REPO="moshfeu/ai-tools"
BRANCH="main"
EXT_PATH="copilot-extensions/ask-notifier/extension.mjs"
RAW_URL="https://raw.githubusercontent.com/$REPO/$BRANCH/$EXT_PATH"
DEST="$HOME/.copilot/extensions/ask-notifier"

echo "📦 Installing ask-notifier..."

# Install terminal-notifier if brew is available
if command -v brew &>/dev/null; then
  if ! command -v terminal-notifier &>/dev/null; then
    echo "🍺 Installing terminal-notifier..."
    brew install terminal-notifier
  else
    echo "✓ terminal-notifier already installed"
  fi
else
  echo "⚠️  Homebrew not found — skipping terminal-notifier (notifications will still work via osascript)"
fi

# Download extension
mkdir -p "$DEST"
if command -v curl &>/dev/null; then
  curl -fsSL "$RAW_URL" -o "$DEST/extension.mjs"
else
  wget -qO "$DEST/extension.mjs" "$RAW_URL"
fi

echo ""
echo "✅ Installed to $DEST"
echo ""
echo "Restart your Copilot CLI session (/restart) to activate."
