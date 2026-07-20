import { resolve } from "node:path";

const CODE_REVIEW_GRAPH_VERSION = "2.3.5";
const repoRoot = resolve(import.meta.dir, "../..");
const argumentsSet = new Set(Bun.argv.slice(2));
const checkOnly = argumentsSet.has("--check");
const skipBuild = argumentsSet.has("--skip-build");

interface Runner {
  command: string;
  prefix: string[];
  installPackage?: () => void;
}

function execute(
  command: string,
  args: string[],
  options: { quiet?: boolean; allowFailure?: boolean } = {}
): number {
  const result = Bun.spawnSync([command, ...args], {
    cwd: repoRoot,
    stdout: options.quiet ? "ignore" : "inherit",
    stderr: options.quiet ? "ignore" : "inherit",
  });
  if (!options.allowFailure && result.exitCode !== 0) {
    throw new Error(
      `Command failed (${result.exitCode}): ${command} ${args.join(" ")}`
    );
  }
  return result.exitCode;
}

function commandAvailable(command: string, args = ["--version"]): boolean {
  try {
    return execute(command, args, { quiet: true, allowFailure: true }) === 0;
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

function runGraph(runner: Runner, args: string[]): void {
  execute(runner.command, [...runner.prefix, ...args]);
}

const runner = resolveRunner();

if (checkOnly) {
  runGraph(runner, ["status"]);
  console.log(
    `Engineering development tools PASS. code-review-graph ${CODE_REVIEW_GRAPH_VERSION} is reachable for ${repoRoot}.`
  );
  process.exit(0);
}

runner.installPackage?.();
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
    "Authority: OpenSpec → Ponytail → Engineering Discipline → Code Review Graph.",
    "Restart Codex once only when the installer adds the MCP server for the first time.",
  ].join("\n")
);