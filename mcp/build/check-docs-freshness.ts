import { resolve } from "node:path";

const packageRoot = resolve(import.meta.dir, "..");
const docsDir = resolve(packageRoot, "docs");
const targets = ["api.json", "index.html"] as const;
const originals = new Map<string, string>();

function normalizeGeneratedAt(file: (typeof targets)[number], content: string): string {
  if (file === "api.json") {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    parsed.generatedAt = "<generated-at>";
    return JSON.stringify(parsed, null, 2);
  }

  return content.replace(
    /Generated [^<\n]+ from Zod schemas/g,
    "Generated <generated-at> from Zod schemas"
  );
}

async function restoreOriginals(): Promise<void> {
  for (const [file, content] of originals) {
    await Bun.write(resolve(docsDir, file), content);
  }
}

async function checkDocsFreshness(): Promise<number> {
  for (const file of targets) {
    originals.set(file, await Bun.file(resolve(docsDir, file)).text());
  }

  const build = Bun.spawn(["bun", "run", "docs:build"], {
    cwd: packageRoot,
    stdout: "inherit",
    stderr: "inherit",
  });

  const buildExitCode = await build.exited;
  if (buildExitCode !== 0) {
    throw new Error(`Documentation generation failed with exit code ${buildExitCode}.`);
  }

  const stale: string[] = [];
  for (const file of targets) {
    const original = originals.get(file);
    if (original === undefined) {
      throw new Error(`Missing original documentation snapshot for ${file}.`);
    }

    const generated = await Bun.file(resolve(docsDir, file)).text();
    if (normalizeGeneratedAt(file, original) !== normalizeGeneratedAt(file, generated)) {
      stale.push(file);
    }
  }

  if (stale.length === 0) {
    console.log("Generated MCP documentation is fresh.");
    return 0;
  }

  console.error(
    `Generated MCP documentation is stale: ${stale.join(", ")}. Run \`bun run docs:build\` and commit the generated output.`
  );
  return 1;
}

let exitCode = 0;
try {
  exitCode = await checkDocsFreshness();
} catch (error) {
  console.error(error);
  exitCode = 1;
} finally {
  await restoreOriginals();
}

process.exit(exitCode);
