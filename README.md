# ai-tools

A collection of AI assistant tools — extensions, MCP servers, skills, and more — for GitHub Copilot CLI, Claude, Cursor, and other AI tools.

Each tool lives in its own folder and can be installed independently.

## Copilot CLI Extensions

| Tool | Description | Platform |
|------|-------------|----------|
| [ask-notifier](./copilot-extensions/ask-notifier/) | macOS notification when Copilot needs your input | macOS |

## Structure

```
copilot-extensions/   GitHub Copilot CLI user extensions
mcp-servers/          MCP servers (Copilot CLI, Claude, Cursor, etc.)
skills/               GitHub Copilot CLI skills
```

## Installing a tool

Each tool has its own `install.sh`. From the repo root:

```bash
bash copilot-extensions/ask-notifier/install.sh
```

## Contributing

PRs welcome! Ideas for new tools are also welcome via issues.
