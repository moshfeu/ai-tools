# ask-notifier

A [GitHub Copilot CLI](https://docs.github.com/copilot/concepts/agents/about-copilot-cli) extension that sends a macOS notification whenever Copilot needs your input.

When Copilot asks you a question, you'll get a native notification — click it to jump straight back to your terminal, VS Code, or Cursor.

## Install

One command — no cloning required:

```bash
curl -fsSL https://raw.githubusercontent.com/moshfeu/ai-tools/main/copilot-extensions/ask-notifier/install.sh | bash
```

This will:
1. Install `terminal-notifier` via Homebrew (if Homebrew is available)
2. Download the extension to `~/.copilot/extensions/ask-notifier/`

Then restart your session: type `/restart` in the Copilot CLI.

## How it works

Hooks into `onPreToolUse` — just before Copilot shows you a question form, it fires a macOS notification. The CLI form still appears as normal.

**Auto-detected environments:**

| App | Detection |
|-----|-----------|
| Cursor | `CURSOR_TRACE_ID` env var |
| VS Code | `TERM_PROGRAM=vscode` |
| iTerm2 | `TERM_PROGRAM=iTerm.app` |
| Warp | `TERM_PROGRAM=WarpTerminal` |
| Terminal.app | fallback |

## Uninstall

```bash
rm -rf ~/.copilot/extensions/ask-notifier
```
