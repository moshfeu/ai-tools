# ai-tools — Agent Instructions

This is a monorepo of AI assistant tools: Copilot CLI extensions, MCP servers, and skills.

## Repo Structure

```
copilot-extensions/<name>/
  extension.mjs     ← Copilot CLI user extension (ES module)
  install.sh        ← NOT used for installation (see bin/cli.mjs)
  README.md         ← Tool-specific docs

bin/cli.mjs         ← npx entry point — registers all tools
package.json        ← npm package, bin points to bin/cli.mjs
```

> `install.sh` files exist as fallback docs but the canonical install is `npx github:moshfeu/ai-tools <name>`.

## How Users Install a Tool

```bash
npx github:moshfeu/ai-tools <tool-name>
```

No npm publish needed — npx fetches directly from GitHub.

## Adding a New Copilot CLI Extension

### 1. Create the extension folder

```
copilot-extensions/<name>/
  extension.mjs
  README.md
```

### 2. Write `extension.mjs`

Must be an ES module that calls `joinSession()` from `@github/copilot-sdk/extension`.

Minimal skeleton:

```js
import { joinSession } from "@github/copilot-sdk/extension";

const session = await joinSession({
  hooks: {
    onPreToolUse: async (input) => {
      // input.toolName, input.toolArgs
    },
    onPostToolUse: async (input) => {
      // input.toolName, input.toolResult
    },
  },
});

// Listen to events
session.on("permission.requested", (event) => {
  // event.data.permissionRequest.kind — "shell" | "write" | "read" | "url"
  // event.data.permissionRequest.fullCommandText (for shell)
  // event.data.permissionRequest.path (for file ops)
});
```

Available hooks: `onPreToolUse`, `onPostToolUse`, `onUserPromptSubmitted`, `onSessionStart`, `onSessionEnd`, `onErrorOccurred`.

Key events: `ask_user`, `permission.requested`, `tool.execution_complete`, `assistant.message`, `session.idle`.

### 3. Register in `bin/cli.mjs`

Add an entry to the `TOOLS` object:

```js
"my-tool": {
  description: "One-line description shown in the tool list",
  type: "copilot-extension",
  src: join(__dirname, "../copilot-extensions/my-tool/extension.mjs"),
  dest: join(homedir(), ".copilot/extensions/my-tool/extension.mjs"),
  deps: [
    // Optional system dependencies
    { name: "some-cli", brew: "some-brew-formula", platform: "darwin" },
  ],
},
```

### 4. Update the root README.md table

Add a row to the **Copilot CLI Extensions** table.

### 5. Test locally

```bash
node bin/cli.mjs my-tool
```

Then restart the Copilot CLI session (`/restart`) and verify the extension loads.

## macOS Notifications Pattern (ask-notifier)

The `ask-notifier` extension is a good reference. Key points:
- Use `terminal-notifier` with `-sender <bundleId>` for the app icon
- Use `-execute "<cli> '<cwd>'"` to focus the right window **on click** (not immediately)
- Detect the host app via `process.env.TERM_PROGRAM` and `CURSOR_*` env vars
- Fall back to `osascript` if `terminal-notifier` is not installed

## Rules

- All extension files must be named `extension.mjs` (ES modules only — `.mjs` required by the Copilot CLI SDK)
- Never commit secrets or tokens
- Each tool must be independently installable via `bin/cli.mjs`
- Keep each extension self-contained — no shared runtime code between extensions
