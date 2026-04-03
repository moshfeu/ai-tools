# Copilot Instructions — ai-tools

This repo follows the conventions in `AGENTS.md`. Read it first.

## Key reminders for Copilot

- To add a tool: create `copilot-extensions/<name>/extension.mjs`, then register it in `bin/cli.mjs`
- Always use ES module syntax (`import`/`export`) — no CommonJS
- Test with `node bin/cli.mjs <name>` before committing
- After any change to an extension, remind the user to re-install (`npx github:moshfeu/ai-tools <name>`) and `/restart` their session
