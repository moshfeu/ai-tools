import { joinSession } from "@github/copilot-sdk/extension";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// ── App detection ────────────────────────────────────────────────────────────

function detectApp() {
  if (process.env.CURSOR_TRACE_ID || process.env.CURSOR_SESSION_ID) {
    return { name: "Cursor", bundleId: "com.todesktop.230313mzl4w4u92", cli: "cursor" };
  }
  if (process.env.TERM_PROGRAM === "vscode") {
    return { name: "VS Code", bundleId: "com.microsoft.VSCode", cli: "code" };
  }
  if (process.env.TERM_PROGRAM === "iTerm.app") {
    return { name: "iTerm2", bundleId: "com.googlecode.iterm2", cli: null };
  }
  if (process.env.TERM_PROGRAM === "WarpTerminal") {
    return { name: "Warp", bundleId: "dev.warp.Warp-Stable", cli: null };
  }
  return { name: "Terminal", bundleId: "com.apple.Terminal", cli: null };
}

// ── terminal-notifier: check availability ────────────────────────────────────

let terminalNotifierAvailable = null; // cached after first check

async function ensureTerminalNotifier() {
  if (terminalNotifierAvailable !== null) return terminalNotifierAvailable;
  try {
    await execAsync("which terminal-notifier");
    terminalNotifierAvailable = true;
  } catch {
    terminalNotifierAvailable = false;
  }
  return terminalNotifierAvailable;
}

// ── Notification ─────────────────────────────────────────────────────────────

function escape(str) {
  return (str ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').slice(0, 300);
}

async function notify(question) {
  const app = detectApp();
  const title = "Copilot needs your answer";
  const msg = escape(question);
  const cwd = process.cwd();

  if (await ensureTerminalNotifier()) {
    // -sender: show the hosting app's icon
    // -execute: focus the exact window only when notification is clicked
    const onClick = app.cli
      ? `${app.cli} '${cwd}'`
      : `osascript -e 'tell application id "${app.bundleId}" to activate'`;

    await execAsync(
      `terminal-notifier -title "${title}" -message "${msg}" -sender "${app.bundleId}" -execute "${onClick}" -sound Glass`
    ).catch(() => {});
  } else {
    // Fallback: plain OS notification (no click handler available)
    await execAsync(
      `osascript -e 'display notification "${msg}" with title "${title}" sound name "Glass"'`
    ).catch(() => {});
  }
}

// ── Extension ────────────────────────────────────────────────────────────────

const session = await joinSession({
  hooks: {
    onPreToolUse: async (input) => {
      if (input.toolName === "ask_user") {
        const question = input.toolArgs?.message ?? "Copilot needs your input";
        notify(question).catch(() => {});
      }
    },
  },
});

// Also notify on permission requests (e.g. "Do you want to run this command?")
session.on("permission.requested", (event) => {
  const kind = event.data?.permissionRequest?.kind ?? "action";
  const detail = event.data?.permissionRequest?.fullCommandText
    ?? event.data?.permissionRequest?.path
    ?? kind;
  const messages = {
    shell: `Run command: ${detail}`,
    write: `Write file: ${detail}`,
    read: `Read file: ${detail}`,
    url: `Access URL: ${detail}`,
  };
  const message = messages[kind] ?? `Permission needed: ${detail}`;
  notify(message).catch(() => {});
});
