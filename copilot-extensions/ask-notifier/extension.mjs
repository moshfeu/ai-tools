import { joinSession } from "@github/copilot-sdk/extension";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// ── App detection ────────────────────────────────────────────────────────────

function detectApp() {
  if (process.env.CURSOR_TRACE_ID || process.env.CURSOR_SESSION_ID) {
    return { name: "Cursor", bundleId: "com.todesktop.230313mzl4w4u92" };
  }
  if (process.env.TERM_PROGRAM === "vscode") {
    return { name: "VS Code", bundleId: "com.microsoft.VSCode" };
  }
  if (process.env.TERM_PROGRAM === "iTerm.app") {
    return { name: "iTerm2", bundleId: "com.googlecode.iterm2" };
  }
  if (process.env.TERM_PROGRAM === "WarpTerminal") {
    return { name: "Warp", bundleId: "dev.warp.Warp-Stable" };
  }
  return { name: "Terminal", bundleId: "com.apple.Terminal" };
}

// ── terminal-notifier: auto-install on first use ─────────────────────────────

let terminalNotifierAvailable = null; // cached after first check

async function ensureTerminalNotifier() {
  if (terminalNotifierAvailable !== null) return terminalNotifierAvailable;
  try {
    await execAsync("which terminal-notifier");
    terminalNotifierAvailable = true;
  } catch {
    // Not installed — try to install silently via Homebrew
    try {
      await execAsync("brew install terminal-notifier");
      terminalNotifierAvailable = true;
    } catch {
      terminalNotifierAvailable = false;
    }
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

  if (await ensureTerminalNotifier()) {
    await execAsync(
      `terminal-notifier -title "${title}" -message "${msg}" -activate "${app.bundleId}" -sound Glass`
    ).catch(() => {});
  } else {
    // Fallback: OS notification + activate app
    await execAsync(
      `osascript -e 'display notification "${msg}" with title "${title}" sound name "Glass"'`
    ).catch(() => {});
    await execAsync(
      `osascript -e 'tell application id "${app.bundleId}" to activate'`
    ).catch(() => {});
  }
}

// ── Extension ────────────────────────────────────────────────────────────────

await joinSession({
  hooks: {
    onPreToolUse: async (input) => {
      if (input.toolName === "ask_user") {
        const question = input.toolArgs?.message ?? "Copilot needs your input";
        notify(question).catch(() => {});
      }
    },
  },
});
