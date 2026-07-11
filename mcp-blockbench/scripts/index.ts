import { watch, type FSWatcher } from "node:fs";
import { mkdir, copyFile, rename, rm, stat } from "node:fs/promises";
import { resolve, join, normalize, sep } from "node:path";
import { log, c, isCleanMode, isProduction, isWatchMode } from "./utils";
import { blockbenchCompatPlugin, textFileLoaderPlugin } from "./plugins";
import { version } from "../package.json";

const OUTPUT_DIR = "./dist";
const OUTPUT_DIR_NAME = normalize(OUTPUT_DIR).replace(/^\.[\\/]/, "");
const ENTRY_FILE = resolve("./src/index.ts");
const WATCHED_DIRECTORIES = ["src", "scripts", "prompts"].map(normalize);
const WATCHED_FILES = new Set(
  ["package.json", "tsconfig.json", join("src", "assets", "icon.svg")].map(normalize)
);
const EXTERNAL_WATCH_TARGETS = [
  resolve("../engines/shared/profiles"),
  resolve("../docs/product/about.md"),
];

function shouldRebuild(filename: string): boolean {
  const path = normalize(filename);
  if (path === OUTPUT_DIR_NAME || path.startsWith(`${OUTPUT_DIR_NAME}${sep}`)) return false;
  if (path.includes(".git") || path === "node_modules" || path.startsWith(`node_modules${sep}`)) return false;
  if (path.endsWith(".js.map")) return false;
  if (WATCHED_FILES.has(path)) return true;
  return WATCHED_DIRECTORIES.some((dir) => path === dir || path.startsWith(`${dir}${sep}`));
}

async function cleanOutput(): Promise<void> {
  try {
    if ((await stat(OUTPUT_DIR)).isDirectory()) {
      await rm(OUTPUT_DIR, { recursive: true, force: true });
    }
  } catch {
    // Output does not exist.
  }
}

async function buildPlugin(): Promise<boolean> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const result = await Bun.build({
    entrypoints: [ENTRY_FILE],
    outdir: OUTPUT_DIR,
    target: "node",
    format: "cjs",
    sourcemap: Bun.argv.includes("--sourcemap") ? "external" : "none",
    plugins: [blockbenchCompatPlugin, textFileLoaderPlugin],
    external: [
      "three",
      "tinycolor2",
      "node:module",
      "node:fs",
      "node:fs/promises",
      "node:child_process",
      "node:https",
      "node:net",
      "node:tls",
      "node:util",
      "node:os",
      "node:v8",
      "child_process",
      "http",
      "https",
      "net",
      "tls",
      "util",
      "os",
      "v8",
    ],
    minify: isProduction,
    define: {
      "process.env.NODE_ENV": isProduction ? '"production"' : '"development"',
      __DEV__: isProduction ? "false" : "true",
    },
    drop: isProduction ? ["debugger"] : [],
  });

  if (!result.success) {
    result.logs.forEach((entry) => log.error(String(entry)));
    return false;
  }

  const iconSource = resolve("./src/assets/icon.svg");
  if (await Bun.file(iconSource).exists()) {
    await copyFile(iconSource, join(OUTPUT_DIR, "icon.svg"));
  }

  const indexFile = join(OUTPUT_DIR, "index.js");
  const mcpFile = join(OUTPUT_DIR, "mcp.js");
  if (await Bun.file(indexFile).exists()) await rename(indexFile, mcpFile);

  if (await Bun.file(mcpFile).exists()) {
    const current = await Bun.file(mcpFile).text();
    const banner = `/* v${version} */\nlet process = requireNativeModule('process');`;
    if (!current.startsWith(banner)) await Bun.write(mcpFile, banner + current);
  }

  const indexMap = join(OUTPUT_DIR, "index.js.map");
  if (await Bun.file(indexMap).exists()) await rename(indexMap, join(OUTPUT_DIR, "mcp.js.map"));

  const aboutSource = resolve("../docs/product/about.md");
  if (await Bun.file(aboutSource).exists()) {
    await copyFile(aboutSource, join(OUTPUT_DIR, "about.md"));
  }

  return true;
}

function watchFiles(): void {
  let running: Promise<void> | null = null;
  let pending = false;
  const watchers: FSWatcher[] = [];

  const queue = (filename: string) => {
    if (running) {
      pending = true;
      return;
    }
    running = (async () => {
      do {
        pending = false;
        log.step(`File changed: ${c.cyan}${filename}${c.reset}`);
        await cleanOutput();
        if (!(await buildPlugin())) throw new Error("Rebuild failed");
      } while (pending);
    })().finally(() => {
      running = null;
    });
  };

  watchers.push(
    watch("./", { recursive: true }, (_event, filename) => {
      if (filename && shouldRebuild(filename)) queue(filename);
    })
  );

  for (const target of EXTERNAL_WATCH_TARGETS) {
    try {
      watchers.push(
        watch(target, { recursive: true }, (_event, filename) => {
          queue(filename ? `${target}:${filename}` : target);
        })
      );
    } catch {
      log.dim(`[Build] Optional watch target unavailable: ${target}`);
    }
  }

  process.on("SIGINT", () => {
    watchers.forEach((watcher) => watcher.close());
    process.exit(0);
  });
}

async function main(): Promise<void> {
  log.header("[Build] MCP Plugin");
  if (isCleanMode) await cleanOutput();
  const success = await buildPlugin();
  if (!success) process.exit(1);
  log.success(`Build completed in ${OUTPUT_DIR}`);
  if (isWatchMode) watchFiles();
}

main().catch((error) => {
  log.error(String(error));
  process.exit(1);
});
