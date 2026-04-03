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

No cloning or npm publish needed — install directly from GitHub:

```bash
npx github:moshfeu/ai-tools ask-notifier
```

Run without arguments to list all available tools:

```bash
npx github:moshfeu/ai-tools
```

## Contributing

PRs welcome! Ideas for new tools are also welcome via issues.
