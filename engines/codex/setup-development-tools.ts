import { resolve } from "node:path";

const CODE_REVIEW_GRAPH_VERSION = "2.3.7";
const repoRoot = resolve(import.meta.dir, "../..");
const argumentsSet = new Set(Bun.argv.slice(2));
const checkOnly = argumentsSet.has("--check");
const skipBuild = argumentsSet.has("--skip-build");
const maintenanceCommand = ["build", "update", "status"].find((command) =>
  argumentsSet.has(`--${command}`)
);

interface Runner {
  command: string;
  prefix: string[];
  installPackage?: () => void;
}

interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function runCommand(command: string, args: string[], quiet = false): CommandResult {
  const result = Bun.spawnSync([command, ...args], {
    cwd: repoRoot,
    stdout: quiet ? "pipe" : "inherit",
    stderr: quiet ? "pipe" : "inherit",
  });
  const decoder = new TextDecoder();
  return {
    exitCode: result.exitCode,
    stdout: result.stdout ? decoder.decode(result.stdout) : "",
    stderr: result.stderr ? decoder.decode(result.stderr) : "",
  };
}

function execute(command: string, args: string[]): void {
  const result = runCommand(command, args);
  if (result.exitCode !== 0) {
    throw new Error(
      `Command failed (${result.exitCode}): ${command} ${args.join(" ")}`
    );
  }
}

function commandAvailable(command: string, args = ["--version"]): boolean {
  try {
    return runCommand(command, args, true).exitCode === 0;
  } catch {
    return false;
  }
}

function pythonRunner(): Runner | null {
  const candidates =
    process.platform === "win32"
      ? [
          { command: "py", versionArgs: ["-3", "--version"], prefix: ["-3"] },
          { command: "python", versionArgs: ["--version"], prefix: [] },
          { command: "python3", versionArgs: ["--version"], prefix: [] },
        ]
      : [
          { command: "python3", versionArgs: ["--version"], prefix: [] },
          { command: "python", versionArgs: ["--version"], prefix: [] },
        ];

  for (const candidate of candidates) {
    if (!commandAvailable(candidate.command, candidate.versionArgs)) continue;
    return {
      command: candidate.command,
      prefix: [...candidate.prefix, "-m", "code_review_graph"],
      installPackage: () =>
        execute(candidate.command, [
          ...candidate.prefix,
          "-m",
          "pip",
          "install",
          `code-review-graph==${CODE_REVIEW_GRAPH_VERSION}`,
        ]),
    };
  }
  return null;
}

function resolveRunner(): Runner {
  if (commandAvailable("uvx")) {
    return {
      command: "uvx",
      prefix: [`code-review-graph==${CODE_REVIEW_GRAPH_VERSION}`],
    };
  }

  const python = pythonRunner();
  if (python) return python;

  throw new Error(
    "Code Review Graph setup requires uvx or Python 3.10+. Install uv or Python, then rerun bun run engineering:setup."
  );
}

function graphCommand(runner: Runner, args: string[]): string[] {
  return [...runner.prefix, ...args];
}

function runGraph(runner: Runner, args: string[]): void {
  execute(runner.command, graphCommand(runner, args));
}

function assertPinnedVersion(runner: Runner): void {
  const result = runCommand(
    runner.command,
    graphCommand(runner, ["--version"]),
    true
  );
  if (result.exitCode !== 0) {
    throw new Error(
      `Unable to read code-review-graph version: ${result.stderr.trim() || "unknown error"}`
    );
  }
  const output = `${result.stdout}\n${result.stderr}`;
  if (!output.includes(CODE_REVIEW_GRAPH_VERSION)) {
    throw new Error(
      `Code Review Graph version mismatch. Expected ${CODE_REVIEW_GRAPH_VERSION}; received ${output.trim() || "no version output"}.`
    );
  }
}

const runner = resolveRunner();

if (maintenanceCommand) {
  assertPinnedVersion(runner);
  runGraph(runner, [maintenanceCommand]);
  process.exit(0);
}

if (checkOnly) {
  assertPinnedVersion(runner);
  runGraph(runner, ["status"]);
  console.log(
    `Engineering development tools PASS. code-review-graph ${CODE_REVIEW_GRAPH_VERSION} is reachable for ${repoRoot}.`
  );
  process.exit(0);
}

runner.installPackage?.();
assertPinnedVersion(runner);
runGraph(runner, ["install", "--platform", "codex"]);

if (!skipBuild) {
  runGraph(runner, ["build"]);
}

runGraph(runner, ["status"]);
console.log(
  [
    "Engineering development tools are ready.",
    `Repository: ${repoRoot}`,
    `code-review-graph: ${CODE_REVIEW_GRAPH_VERSION}`,
    "Domain role: optional context intelligence confirmed against current source.",
    "Restart Codex once only when the installer adds the MCP server for the first time.",
  ].join("\n")
);
