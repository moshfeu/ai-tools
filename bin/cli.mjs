#!/usr/bin/env node

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, platform } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

const TOOLS = {
  "ask-notifier": {
    description: "macOS notification when Copilot CLI needs your input",
    type: "copilot-extension",
    src: join(__dirname, "../copilot-extensions/ask-notifier/extension.mjs"),
    dest: join(homedir(), ".copilot/extensions/ask-notifier/extension.mjs"),
    deps: [
      { name: "terminal-notifier", brew: "terminal-notifier", platform: "darwin" },
    ],
  },
};

const tool = process.argv[2];

if (!tool) {
  console.log("Usage: npx github:moshfeu/ai-tools <tool-name>\n");
  console.log("Available tools:");
  for (const [name, { description }] of Object.entries(TOOLS)) {
    console.log(`  ${name.padEnd(20)} ${description}`);
  }
  process.exit(0);
}

const config = TOOLS[tool];
if (!config) {
  console.error(`Unknown tool: "${tool}"\nRun without arguments to see available tools.`);
  process.exit(1);
}

console.log(`📦 Installing ${tool}...`);

// Install system deps
for (const dep of config.deps ?? []) {
  if (dep.platform && dep.platform !== platform()) continue;
  try {
    execSync(`which ${dep.name}`, { stdio: "ignore" });
    console.log(`✓ ${dep.name} already installed`);
  } catch {
    if (dep.brew) {
      try {
        execSync("which brew", { stdio: "ignore" });
        console.log(`🍺 Installing ${dep.name}...`);
        execSync(`brew install ${dep.brew}`, { stdio: "inherit" });
      } catch {
        console.warn(`⚠️  Homebrew not found — skipping ${dep.name} (notifications will still work via osascript)`);
      }
    }
  }
}

// Copy extension file
const destDir = dirname(config.dest);
mkdirSync(destDir, { recursive: true });
writeFileSync(config.dest, readFileSync(config.src));

console.log(`\n✅ ${tool} installed!`);
console.log(`   ${config.dest}`);
console.log("\nRestart your Copilot CLI session (/restart) to activate.");
